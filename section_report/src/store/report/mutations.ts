import Vue from 'vue';
import { MutationsBase } from '../base/mutations-base';
import { computeTextFontAndLineSize } from '../lib/text-font-and-line-size';
import TextBlockItemBuilder from './builders/text-block-item-builder';
import TextItemBuilder from './builders/text-item-builder';
import { convertBPointsToEllipseItemBounds } from '@/lib/bounds-transformer';
import { roundBoundingPoints, roundImageBlockItem, roundImageItem, roundLineItem, roundRectItem, roundStackViewItem, roundStackViewRow, roundTextBlockItem, roundTextItem } from '@/lib/round-float-values';
import { deleteNormalizedValue, setNormalizedValue } from '@/store/lib/normalize-helper';
import { ActiveEntity, AnyItem, AnySection, AnyUid, CanvasType, DetailSection, FooterSection, HeaderSection, ItemUid, RectItem, Report, SectionUid, StackViewItem, StackViewRow, StackViewRowUid, EllipseItem, LineItem, TextItem, ImageBlockItem, ImageItem, TextBlockItem, CanvasUid, EllipseItemBase, BoundingPoints, FontAndLineSize } from '@/types';

class MutationError extends Error {
  constructor (message: string, state: Report) {
    super(
      `${message}\n` +
      '----- state -----\n' +
      `${JSON.stringify(state)}\n` +
      '----- state -----'
    );
    this.name = 'MutationError';
  }
}

const SECTION_TYPE_MAP = {
  header: 'headers',
  detail: 'details',
  footer: 'footers'
} as const;

export class Mutations extends MutationsBase<Report> {
  private entityNotFoundError (type: string, uid: AnyUid): MutationError {
    return new MutationError(`${type}(${uid}) is not found.`, this.state);
  }

  setActiveEntity (payload: ActiveEntity) {
    this.state.activeEntity = payload;
  }

  resetActiveEntity () {
    this.state.activeEntity = null;
  }

  addSection ({ section }: { section: AnySection }) {
    setNormalizedValue(this.state.entities.sections, this.state.sections[SECTION_TYPE_MAP[section.type]], section);
  }

  removeSection ({ sectionUid }: { sectionUid: SectionUid }) {
    const section = this.state.entities.sections[sectionUid];
    if (!section) throw this.entityNotFoundError('Section', sectionUid);
    deleteNormalizedValue(this.state.entities.sections, this.state.sections[SECTION_TYPE_MAP[section.type]], section.uid);
  }

  moveSection ({ sectionUid, direction }: { sectionUid: SectionUid; direction: 'up' | 'down' }) {
    const section = this.state.entities.sections[sectionUid];
    if (!section) throw this.entityNotFoundError('Section', sectionUid);

    const sectionsKey = SECTION_TYPE_MAP[section.type];
    const sections = this.state.sections[sectionsKey];

    const index = sections.indexOf(sectionUid);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    this.state.sections[sectionsKey].splice(index, 1);
    this.state.sections[sectionsKey].splice(index + (direction === 'up' ? -1 : 1), 0, sectionUid);
  }

  updateHeaderSection <K extends keyof HeaderSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: HeaderSection[K]}) {
    const section = this.state.entities.sections[sectionUid];
    if (!section || section.type !== 'header') throw this.entityNotFoundError('Section', sectionUid);

    section[key] = value;
  }

  updateDetailSection <K extends keyof DetailSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: DetailSection[K]}) {
    const section = this.state.entities.sections[sectionUid];
    if (!section || section.type !== 'detail') throw this.entityNotFoundError('Section', sectionUid);

    section[key] = value;
  }

  updateFooterSection <K extends keyof FooterSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: FooterSection[K]}) {
    const section = this.state.entities.sections[sectionUid];
    if (!section || section.type !== 'footer') throw this.entityNotFoundError('Section', sectionUid);

    section[key] = value;
  }

  addItem ({ targetType, targetUid, item }: { targetType: CanvasType; targetUid: CanvasUid; item: AnyItem }) {
    let newItem: AnyItem;

    switch (item.type) {
      case 'rect': newItem = roundRectItem(item); break;
      case 'ellipse': newItem = item; break;
      case 'line': newItem = roundLineItem(item); break;
      case 'text': newItem = roundTextItem(item); break;
      case 'text-block': newItem = roundTextBlockItem(item); break;
      case 'image-block': newItem = roundImageBlockItem(item); break;
      case 'image': newItem = roundImageItem(item); break;
      case 'stack-view': newItem = roundStackViewItem(item); break;
      default: throw new Error(`Invalid itemType: ${(item as AnyItem).type}`);
    }

    if (targetType === 'section') {
      const sectionEntity = this.state.entities.sections[targetUid as SectionUid];
      if (!sectionEntity) throw this.entityNotFoundError('Section', targetUid);
      setNormalizedValue(this.state.entities.items, sectionEntity.items, newItem);
    } else {
      const rowEntity = this.state.entities.stackViewRows[targetUid as StackViewRowUid];
      if (!rowEntity) throw this.entityNotFoundError('StackViewRow', targetUid);
      setNormalizedValue(this.state.entities.items, rowEntity.items, newItem);
    }
  }

  addEllipseItem ({ targetType, targetUid, item, bounds }: { targetType: CanvasType; targetUid: SectionUid | StackViewRowUid; item: EllipseItemBase; bounds: BoundingPoints }) {
    const roundedBPoints = roundBoundingPoints(bounds);
    // BoundingPoints へ移行したら不要になる
    const itemBounds = convertBPointsToEllipseItemBounds(roundedBPoints);
    const ellipseItem: EllipseItem = {
      ...item,
      cx: itemBounds.cx,
      cy: itemBounds.cy,
      rx: itemBounds.rx,
      ry: itemBounds.ry
    };

    this.addItem({ targetType, targetUid, item: ellipseItem });
  }

  removeItem ({ targetUid, uid }: { targetUid: CanvasUid; uid: ItemUid }) {
    const parent = this.state.entities.sections[targetUid as SectionUid] || this.state.entities.stackViewRows[targetUid as StackViewRowUid];

    if (!parent) throw this.entityNotFoundError('Parent', targetUid);

    deleteNormalizedValue(this.state.entities.items, parent.items, uid);
  }

  updateRectItem <K extends keyof RectItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: RectItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'rect') throw this.entityNotFoundError('Rect', uid);

    Vue.set(this.state.entities.items, uid, roundRectItem({ ...item, [key]: value }));
  }

  updateEllipseItem <K extends keyof EllipseItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: EllipseItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'ellipse') throw this.entityNotFoundError('Ellipse', uid);

    item[key] = value;
  }

  updateLineItem <K extends keyof LineItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: LineItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'line') throw this.entityNotFoundError('Line', uid);

    Vue.set(this.state.entities.items, uid, roundLineItem({ ...item, [key]: value }));
  }

  // TODO: Deprecated. Use #updateTextItemWithBuild instead.
  // Finally, remove this method and rename updateTextItemWithBuild to updateTextItem.
  updateTextItem <K extends keyof TextItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: TextItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'text') throw this.entityNotFoundError('Text', uid);

    Vue.set(this.state.entities.items, uid, roundTextItem({ ...item, [key]: value }));
  }

  updateTextItemWithBuild ({ uid, builder }: { uid: ItemUid; builder: TextItemBuilder }) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'text') throw this.entityNotFoundError('Text', uid);

    Vue.set(this.state.entities.items, uid, builder.build());
  }

  updateImageBlockItem <K extends keyof ImageBlockItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: ImageBlockItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'image-block') throw this.entityNotFoundError('ImageBlock', uid);

    Vue.set(this.state.entities.items, uid, roundImageBlockItem({ ...item, [key]: value }));
  }

  updateImageItem <K extends keyof ImageItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: ImageItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'image') throw this.entityNotFoundError('Image', uid);

    Vue.set(this.state.entities.items, uid, roundImageItem({ ...item, [key]: value }));
  }

  // TODO: Deprecated. Use #updateTextBlockItemWithBuild instead.
  // Finally, remove this method and rename updateTextBlockItemWithBuild to updateTextBlockItem.
  updateTextBlockItem <K extends keyof TextBlockItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: TextBlockItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'text-block') throw this.entityNotFoundError('TextBlock', uid);

    Vue.set(this.state.entities.items, uid, roundTextBlockItem({ ...item, [key]: value }));
  }

  updateTextBlockItemWithBuild ({ uid, builder }: { uid: ItemUid; builder: TextBlockItemBuilder }) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'text-block') throw this.entityNotFoundError('TextBlock', uid);

    Vue.set(this.state.entities.items, uid, builder.build());
  }

  updateTextFontAndLineSize ({ uid, fontSize, lineHeightRatio }: { uid: ItemUid; fontSize: FontAndLineSize['fontSize']; lineHeightRatio: FontAndLineSize['lineHeightRatio'] }) {
    const item = this.state.entities.items[uid];
    if (!item || (item.type !== 'text' && item.type !== 'text-block')) throw this.entityNotFoundError('Text or TextBlock', uid);

    item.style = {
      ...item.style,
      ...computeTextFontAndLineSize({ fontSize, lineHeightRatio })
    };
  }

  addStackViewRow ({ uid, row }: { uid: ItemUid; row: StackViewRow }) {
    const stackView = this.state.entities.items[uid];

    if (!stackView || stackView.type !== 'stack-view') throw this.entityNotFoundError('StackViewRow', uid);

    setNormalizedValue(this.state.entities.stackViewRows, stackView.rows, roundStackViewRow(row));
  }

  removeStackViewRow ({ uid, rowUid }: { uid: ItemUid; rowUid: StackViewRowUid }) {
    const stackView = this.state.entities.items[uid];

    if (!stackView || stackView.type !== 'stack-view') throw this.entityNotFoundError('StackViewRow', uid);

    deleteNormalizedValue(this.state.entities.stackViewRows, stackView.rows, rowUid);
  }

  moveStackViewRow ({ uid, rowUid, direction }: { uid: ItemUid; rowUid: StackViewRowUid; direction: 'up' | 'down' }) {
    const stackView = this.state.entities.items[uid];

    if (!stackView || stackView.type !== 'stack-view') throw this.entityNotFoundError('StackViewRow', uid);

    const index = stackView.rows.indexOf(rowUid);

    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === stackView.rows.length - 1) return;

    stackView.rows.splice(index, 1);
    stackView.rows.splice(index + (direction === 'up' ? -1 : 1), 0, rowUid);
  }

  updateStackViewItem <K extends keyof StackViewItem> ({ uid, key, value }: {uid: ItemUid; key: K; value: StackViewItem[K]}) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'stack-view') throw this.entityNotFoundError('Item', uid);

    Vue.set(this.state.entities.items, uid, roundStackViewItem({ ...item, [key]: value }));
  }

  updateStackViewRow <K extends keyof StackViewRow> ({ uid, key, value }: {uid: StackViewRowUid; key: K; value: StackViewRow[K]}) {
    const row = this.state.entities.stackViewRows[uid];
    if (!row) throw this.entityNotFoundError('StackViewRow', uid);

    Vue.set(this.state.entities.stackViewRows, uid, roundStackViewRow({ ...row, [key]: value }));
  }

  bringItemLayerTo ({ uid, destination }: { uid: ItemUid; destination: 'front' | 'forward' | 'back' | 'backward' }) {
    const parent: AnySection | StackViewRow | undefined =
      Object.values(this.state.entities.sections).find(section => section!.items.includes(uid)) ||
      Object.values(this.state.entities.stackViewRows).find(row => row!.items.includes(uid));

    if (!parent) throw this.entityNotFoundError('Parent', uid);

    const items = parent.items;
    const currentIndex = items.indexOf(uid);

    switch (destination) {
      case 'front':
        if (items.length !== currentIndex + 1) {
          items.splice(currentIndex, 1);
          items.push(uid);
        }
        break;
      case 'forward':
        if (items.length !== currentIndex + 1) {
          items.splice(currentIndex, 2, ...[items[currentIndex + 1], uid]);
        }
        break;
      case 'back':
        if (currentIndex > 0) {
          items.splice(currentIndex, 1);
          items.unshift(uid);
        }
        break;
      case 'backward':
        if (currentIndex > 0) {
          items.splice(currentIndex - 1, 2, ...[uid, items[currentIndex - 1]]);
        }
        break;
      default:
        throw new MutationError(`Invalid desstination: ${destination}`, this.state);
    }
  }

  updateEllipseItemBounds (uid: ItemUid, bounds: BoundingPoints) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'ellipse') throw this.entityNotFoundError('Ellipse', uid);

    const roundedBPoints = roundBoundingPoints(bounds);
    // BoundingPoints へ移行したら不要になる
    const itemBounds = convertBPointsToEllipseItemBounds(roundedBPoints);

    item.cx = itemBounds.cx;
    item.cy = itemBounds.cy;
    item.rx = itemBounds.rx;
    item.ry = itemBounds.ry;
  }
};
