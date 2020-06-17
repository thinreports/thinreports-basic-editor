import _cloneDeep from 'lodash.clonedeep';
import { DeepReadonly } from 'utility-types';
import uuid from 'uuid/v4';
import { ActionsBase } from '../base/actions-base';
import { SaveHistory } from '../lib/save-history-decorator';
import { computeTextFontAndLineSize } from '../lib/text-font-and-line-size';
import TextBlockItemBuilder from './builders/text-block-item-builder';
import TextItemBuilder from './builders/text-item-builder';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { BoundsTransformer } from '@/lib/bounds-transformer';
import { ActiveEntity, AnySection, BoundingPoints, CanvasType, CanvasUid, DetailSection, EllipseItem, EllipseItemBase, FooterSection, HeaderSection, ImageBlockItem, ImageItem, ItemUid, LineItem, RectItem, Report, SectionUid, StackViewItem, StackViewRow, StackViewRowUid, TextBlockItem, TextItem, CopiedAnyItem, CopiedStackViewItem, GraphicItem, CopiedGraphicItem, FontAndLineSize } from '@/types';

export class Actions extends ActionsBase<Report, Getters, Mutations> {
  @SaveHistory()
  addInitialSections () {
    this.addNewHeader();
    this.addNewDetail();
    this.addNewFooter();

    const sections = this.getters.sections();
    this.mutations.setActiveEntity({ type: 'section', uid: sections[0].uid });
  }

  activateEntity (payload: ActiveEntity) {
    this.mutations.setActiveEntity(payload);
  }

  @SaveHistory()
  addNewHeader () {
    const section: HeaderSection = {
      uid: uuid() as SectionUid,
      id: '',
      type: 'header',
      height: 200,
      display: true,
      autoStretch: true,
      everyPage: false,
      items: []
    };
    this.mutations.addSection({ section });
    this.mutations.setActiveEntity({ type: 'section', uid: section.uid });
  }

  @SaveHistory()
  addNewDetail () {
    const section: DetailSection = {
      uid: uuid() as SectionUid,
      id: '',
      type: 'detail',
      height: 200,
      autoStretch: true,
      items: []
    };
    this.mutations.addSection({ section });
    this.mutations.setActiveEntity({ type: 'section', uid: section.uid });
  }

  @SaveHistory()
  addNewFooter () {
    const section: FooterSection = {
      uid: uuid() as SectionUid,
      id: '',
      type: 'footer',
      height: 200,
      display: true,
      autoStretch: true,
      items: []
    };
    this.mutations.addSection({ section });
    this.mutations.setActiveEntity({ type: 'section', uid: section.uid });
  }

  @SaveHistory()
  removeActiveEntity () {
    const activeEntity = this.state.activeEntity;

    if (!activeEntity) return;

    if (activeEntity.type === 'section') {
      this.removeActiveSection();
    } else if (activeEntity.type === 'stack-view-row') {
      this.removeActiveStackViewRow();
    } else {
      this.removeActiveItem();
    }
  }

  @SaveHistory()
  removeActiveSection () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'section') return;
    this.removeSection({ sectionUid: this.state.activeEntity.uid });
    this.mutations.resetActiveEntity();
  }

  @SaveHistory()
  moveUpActiveSection () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'section') return;
    this.mutations.moveSection({ sectionUid: this.state.activeEntity.uid, direction: 'up' });
  }

  @SaveHistory()
  moveDownActiveSection () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'section') return;
    this.mutations.moveSection({ sectionUid: this.state.activeEntity.uid, direction: 'down' });
  }

  @SaveHistory()
  updateHeaderSection<K extends keyof HeaderSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: HeaderSection[K]}) {
    this.mutations.updateHeaderSection({ sectionUid, key, value });
  }

  @SaveHistory()
  updateDetailSection<K extends keyof DetailSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: DetailSection[K]}) {
    this.mutations.updateDetailSection({ sectionUid, key, value });
  }

  @SaveHistory()
  updateFooterSection<K extends keyof FooterSection> ({ sectionUid, key, value }: {sectionUid: SectionUid; key: K; value: FooterSection[K]}) {
    this.mutations.updateFooterSection({ sectionUid, key, value });
  }

  addNewRowToActiveStackView () {
    const stackView = this.getters.activeStackView();
    if (!stackView) return;
    this.drawNewStackViewRaw({ uid: stackView.uid, height: 100 });
  }

  @SaveHistory()
  removeActiveStackViewRow () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'stack-view-row') return;

    const stackView = this.getters.activeStackView();
    if (!stackView) return;

    const isLastRow = stackView.rows.length === 1;

    const rowUid = isLastRow ? stackView.rows[0] : this.state.activeEntity.uid;
    const stackViewRow = this.getters.findStackViewRow(rowUid);

    this.removeStackViewRow({ targetUid: stackView.uid, rowUid: stackViewRow.uid });

    if (isLastRow) {
      this.removeItem({ uid: stackView.uid });
      this.mutations.resetActiveEntity();
    } else {
      this.activateEntity({ type: 'item', uid: stackView.uid });
    }
  }

  @SaveHistory()
  moveUpActiveStackViewRow () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'stack-view-row') return;

    const stackView = this.getters.activeStackView();
    const stackViewRow = this.getters.findStackViewRow(this.state.activeEntity.uid);

    if (!stackView) return;

    this.mutations.moveStackViewRow({ uid: stackView.uid, rowUid: stackViewRow.uid, direction: 'up' });
  }

  @SaveHistory()
  moveDownActiveStackViewRow () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'stack-view-row') return;

    const stackView = this.getters.activeStackView();
    const stackViewRow = this.getters.findStackViewRow(this.state.activeEntity.uid);

    if (!stackView) return;

    this.mutations.moveStackViewRow({ uid: stackView.uid, rowUid: stackViewRow.uid, direction: 'down' });
  }

  @SaveHistory()
  drawNewRectItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: RectItem = {
      uid: uuid() as ItemUid,
      type: 'rect',
      id: '',
      ...new BoundsTransformer(bounds).toBBox(),
      borderRadius: 0,
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      style: {
        borderColor: '#000000',
        borderStyle: 'solid',
        fillColor: '#ffffff',
        borderWidth: 1
      }
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewEllipseItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: EllipseItemBase = {
      uid: uuid() as ItemUid,
      type: 'ellipse',
      id: '',
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      style: {
        borderWidth: 1,
        borderColor: '#000000',
        borderStyle: 'solid',
        fillColor: '#ffffff'
      }
    };
    this.mutations.addEllipseItem({ targetType, targetUid, item, bounds });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewLineItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: LineItem = {
      uid: uuid() as ItemUid,
      type: 'line',
      id: '',
      ...bounds,
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      style: {
        borderWidth: 1,
        borderColor: '#000000',
        borderStyle: 'solid'
      }
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewTextItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: TextItem = {
      uid: uuid() as ItemUid,
      type: 'text',
      id: '',
      ...new BoundsTransformer(bounds).toBBox(),
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      texts: [],
      contentHeight: 0,
      style: {
        fontFamily: ['Helvetica'],
        color: '#000000',
        fontStyle: [],
        textAlign: 'left',
        verticalAlign: 'top',
        letterSpacing: '',
        ...computeTextFontAndLineSize({ fontSize: 18, lineHeightRatio: '' })
      }
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewTextBlockItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: TextBlockItem = {
      uid: uuid() as ItemUid,
      type: 'text-block',
      id: 'text',
      ...new BoundsTransformer(bounds).toBBox(),
      description: '',
      referenceId: '',
      value: '',
      multipleLine: true,
      display: true,
      format: {
        base: '',
        type: ''
      },
      followStretch: 'none',
      affectBottomMargin: true,
      style: {
        fontFamily: ['Helvetica'],
        color: '#000000',
        fontStyle: [],
        textAlign: 'left',
        verticalAlign: 'top',
        letterSpacing: '',
        overflow: 'truncate',
        wordWrap: 'break-word',
        ...computeTextFontAndLineSize({ fontSize: 18, lineHeightRatio: '' })
      }
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewImageBlockItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    const item: ImageBlockItem = {
      uid: uuid() as ItemUid,
      type: 'image-block',
      id: 'image',
      ...new BoundsTransformer(bounds).toBBox(),
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      style: {
        positionX: 'left',
        positionY: 'top'
      }
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  // FIXME: Store the image data in a store other than the state store, such as localStorage,
  // and the state store holds only references to that image data.
  @SaveHistory()
  drawNewImageItem ({ targetType, targetUid, bounds, data }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints; data: ImageItem['data'] }) {
    const item: ImageItem = {
      uid: uuid() as ItemUid,
      type: 'image',
      id: '',
      ...new BoundsTransformer(bounds).toBBox(),
      description: '',
      display: true,
      followStretch: 'none',
      affectBottomMargin: true,
      data
    };
    this.mutations.addItem({ targetType, targetUid, item });
    this.mutations.setActiveEntity({ type: 'item', uid: item.uid });
  }

  @SaveHistory()
  drawNewStackViewItem ({ targetType, targetUid, bounds }: { targetType: CanvasType; targetUid: CanvasUid; bounds: BoundingPoints }) {
    if (targetType === 'stack-view-row') throw new Error('StackView cannot be drawn in StackViewRow');

    const boundingBox = new BoundsTransformer(bounds).toBBox();
    const item: StackViewItem = {
      uid: uuid() as ItemUid,
      type: 'stack-view',
      id: '',
      x: boundingBox.x,
      y: boundingBox.y,
      width: boundingBox.width,
      description: '',
      display: true,
      affectBottomMargin: true,
      followStretch: 'none',
      rows: []
    };

    this.mutations.addItem({ targetType, targetUid, item });
    this.drawNewStackViewRaw({ uid: item.uid, height: boundingBox.height });
  }

  @SaveHistory()
  drawNewStackViewRaw ({ uid, height }: { uid: ItemUid; height: number }) {
    const row: StackViewRow = {
      uid: uuid() as StackViewRowUid,
      id: '',
      height,
      autoStretch: false,
      display: true,
      items: []
    };

    this.mutations.addStackViewRow({ uid, row });
    this.activateEntity({ uid: row.uid, type: 'stack-view-row' });
  }

  @SaveHistory()
  pasteItem ({ targetType, targetUid, item }: { targetType: CanvasType; targetUid: CanvasUid; item: CopiedAnyItem }) {
    if (item.type === 'stack-view') {
      if (targetType !== 'section') return;
      this.pasteStackViewItem({ targetUid: targetUid as SectionUid, item });
    } else {
      this.pasteGraphicItem({ targetType, targetUid, item });
    }
  }

  @SaveHistory()
  pasteGraphicItem ({ targetType, targetUid, item }: { targetType: CanvasType; targetUid: CanvasUid; item: CopiedGraphicItem }) {
    const newItem: GraphicItem = {
      ..._cloneDeep(item),
      uid: uuid() as ItemUid
    };

    this.mutations.addItem({ targetType, targetUid, item: newItem });
    this.mutations.setActiveEntity({ type: 'item', uid: newItem.uid });
  }

  @SaveHistory()
  pasteStackViewItem ({ targetUid, item }: { targetUid: SectionUid; item: CopiedStackViewItem }) {
    const newStackViewItem: StackViewItem = {
      ..._cloneDeep(item),
      uid: uuid() as ItemUid,
      rows: []
    };

    this.mutations.addItem({ targetType: 'section', targetUid, item: newStackViewItem });

    item.rows.forEach(row => {
      const newRow = {
        ..._cloneDeep(row),
        uid: uuid() as StackViewRowUid,
        items: []
      };

      this.mutations.addStackViewRow({
        uid: newStackViewItem.uid,
        row: newRow
      });

      row.items.forEach(rowItem => {
        this.mutations.addItem({
          targetType: 'stack-view-row',
          targetUid: newRow.uid,
          item: {
            ..._cloneDeep(rowItem),
            uid: uuid() as ItemUid
          }
        });
      });
    });

    this.mutations.setActiveEntity({ type: 'item', uid: newStackViewItem.uid });
  }

  @SaveHistory()
  moveRectItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateRectItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateRectItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  moveEllipseItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateEllipseItemBounds(uid, bounds);
  }

  @SaveHistory()
  moveLineItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateLineItem({ uid, key: 'x1', value: bounds.x1 });
    this.mutations.updateLineItem({ uid, key: 'y1', value: bounds.y1 });
    this.mutations.updateLineItem({ uid, key: 'x2', value: bounds.x2 });
    this.mutations.updateLineItem({ uid, key: 'y2', value: bounds.y2 });
  }

  @SaveHistory()
  moveImageBlockItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateImageBlockItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateImageBlockItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  moveImageItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateImageItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateImageItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  moveTextItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateTextItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateTextItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  moveTextBlockItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateTextBlockItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateTextBlockItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  moveStackViewItemTo ({ uid, bounds }: { uid: ItemUid; bounds: BoundingPoints }) {
    this.mutations.updateStackViewItem({ uid, key: 'x', value: bounds.x1 });
    this.mutations.updateStackViewItem({ uid, key: 'y', value: bounds.y1 });
  }

  @SaveHistory()
  updateRectItem<K extends keyof RectItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: RectItem[K] }) {
    this.mutations.updateRectItem({ uid, key, value });
  }

  @SaveHistory()
  updateEllipseItem<K extends keyof EllipseItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: EllipseItem[K] }) {
    this.mutations.updateEllipseItem({ uid, key, value });
  }

  @SaveHistory()
  updateEllipseItemBounds (uid: ItemUid, bounds: BoundingPoints) {
    this.mutations.updateEllipseItemBounds(uid, bounds);
  }

  @SaveHistory()
  updateEllipseItemValues<K extends keyof EllipseItem> ({ uid, values }: { uid: ItemUid; values: {key: K; value: EllipseItem[K]}[] }) {
    values.forEach(v => this.mutations.updateEllipseItem({ uid, ...v }));
  }

  @SaveHistory()
  updateLineItem<K extends keyof LineItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: LineItem[K] }) {
    this.mutations.updateLineItem({ uid, key, value });
  }

  @SaveHistory()
  updateLineItemValues<K extends keyof LineItem> ({ uid, values }: { uid: ItemUid; values: {key: K; value: LineItem[K]}[] }) {
    values.forEach(v => this.mutations.updateLineItem({ uid, ...v }));
  }

  // TODO: Deprecated. Use #updateTextItemWith instead and rename it to updateTextItem.
  @SaveHistory()
  updateTextItem<K extends keyof TextItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: TextItem[K] }) {
    this.mutations.updateTextItem({ uid, key, value });
  }

  @SaveHistory()
  updateTextItemWith (uid: ItemUid, fn: (builder: TextItemBuilder) => void) {
    const builder = new TextItemBuilder(this.getters.findItem(uid, 'text'));
    fn(builder);
    this.mutations.updateTextItemWithBuild({ uid, builder });
  }

  @SaveHistory({ replaceCurrentPointer: true })
  adjustTextItemWidth ({ uid, minWidth }: { uid: ItemUid; minWidth: number }) {
    const item = this.getters.findItem(uid, 'text');

    if (item.width < minWidth) {
      this.mutations.updateTextItem({ uid, key: 'width', value: minWidth });
    }
  }

  @SaveHistory()
  updateTextBlockItem<K extends keyof TextBlockItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: TextBlockItem[K] }) {
    this.mutations.updateTextBlockItem({ uid, key, value });
  }

  @SaveHistory()
  updateTextBlockItemWith (uid: ItemUid, fn: (builder: TextBlockItemBuilder) => void) {
    const builder = new TextBlockItemBuilder(this.getters.findItem(uid, 'text-block'));
    fn(builder);
    this.mutations.updateTextBlockItemWithBuild({ uid, builder });
  }

  @SaveHistory()
  updateTextFontAndLineSize ({ uid, fontSize, lineHeightRatio }: { uid: ItemUid; fontSize: FontAndLineSize['fontSize']; lineHeightRatio: FontAndLineSize['lineHeightRatio'] }) {
    this.mutations.updateTextFontAndLineSize({ uid, fontSize, lineHeightRatio });
  }

  @SaveHistory()
  updateImageItem<K extends keyof ImageItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: ImageItem[K] }) {
    this.mutations.updateImageItem({ uid, key, value });
  }

  @SaveHistory()
  updateImageBlockItem<K extends keyof ImageBlockItem> ({ uid, key, value }: { uid: ItemUid; key: K; value: ImageBlockItem[K] }) {
    this.mutations.updateImageBlockItem({ uid, key, value });
  }

  @SaveHistory()
  removeActiveItem () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return;
    this.removeItem({ uid: this.state.activeEntity.uid });
    this.mutations.resetActiveEntity();
  }

  @SaveHistory()
  removeSection ({ sectionUid }: { sectionUid: SectionUid }) {
    const section = this.getters.findSection(sectionUid);

    [...section.items].forEach(uid => this.removeItem({ uid }));

    this.mutations.removeSection({ sectionUid });
  }

  @SaveHistory()
  removeItem ({ uid }: { uid: ItemUid }) {
    const item = this.getters.findItem(uid);

    const parent: DeepReadonly<AnySection | StackViewRow | undefined> =
      Object.values(this.state.entities.sections).find(section => section!.items.includes(item.uid)) ||
      Object.values(this.state.entities.stackViewRows).find(row => row!.items.includes(item.uid));

    if (!parent) return;

    if (item.type === 'stack-view') {
      [...item.rows].forEach(rowUid => this.removeStackViewRow({ targetUid: item.uid, rowUid }));
    }
    this.mutations.removeItem({ targetUid: parent.uid, uid: item.uid });
  }

  @SaveHistory()
  removeStackViewRow ({ targetUid, rowUid }: { targetUid: ItemUid; rowUid: StackViewRowUid }) {
    const stackViewRow = this.getters.findStackViewRow(rowUid);

    [...stackViewRow.items].forEach(uid => {
      this.mutations.removeItem({ targetUid: rowUid, uid });
    });

    this.mutations.removeStackViewRow({ uid: targetUid, rowUid });
  }

  @SaveHistory()
  updateStackViewRow<K extends keyof StackViewRow> ({ uid, key, value }: {uid: StackViewRowUid; key: K; value: StackViewRow[K]}) {
    this.mutations.updateStackViewRow({ uid, key, value });
  }

  @SaveHistory()
  updateStackViewItem<K extends keyof StackViewItem> ({ uid, key, value }: {uid: ItemUid; key: K; value: StackViewItem[K]}) {
    this.mutations.updateStackViewItem({ uid, key, value });
  }

  @SaveHistory()
  bringActiveItemToFront () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return;
    this.mutations.bringItemLayerTo({ uid: this.state.activeEntity.uid, destination: 'front' });
  }

  @SaveHistory()
  bringActiveItemForward () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return;
    this.mutations.bringItemLayerTo({ uid: this.state.activeEntity.uid, destination: 'forward' });
  }

  @SaveHistory()
  sendActiveItemToBack () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return;
    this.mutations.bringItemLayerTo({ uid: this.state.activeEntity.uid, destination: 'back' });
  }

  @SaveHistory()
  sendActiveItemBackward () {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return;
    this.mutations.bringItemLayerTo({ uid: this.state.activeEntity.uid, destination: 'backward' });
  }
};
