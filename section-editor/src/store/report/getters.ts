import _cloneDeep from 'lodash.clonedeep';
import { GettersBase } from '../base/getters-base';
import encodeToSchema from '../lib/layout-schema/encode';
import { calcMinus, calcPlus } from '@/lib/strict-calculator';
import { Report, AnyItem, StackViewItem, AnySection, SectionUid, ItemUid, StackViewRowUid, StackViewRow, CanvasUid, CanvasType, BoundingPoints, CopiedAnyItem, CopiedGraphicItem, CopiedStackViewItem, CopiedStackViewRow, Size, ItemType, TypeDetectedItem, GraphicItem } from '@/types';

export class Getters extends GettersBase<Report> {
  toSchemaJSON () {
    const schema = encodeToSchema(this.state);
    return JSON.stringify(schema, null, '  ');
  }

  paperSize () {
    let portraitSize: number[];

    switch (this.state.paperType) {
      case 'A4':
        portraitSize = [595.28, 841.89];
        break;
      default:
        throw new Error('Unknown papyerType');
    }

    if (this.state.orientation === 'landscape') {
      return {
        width: portraitSize[1],
        height: portraitSize[0]
      };
    } else {
      return {
        width: portraitSize[0],
        height: portraitSize[1]
      };
    }
  }

  contentSize (): Size {
    return {
      width: this.paperSize().width,
      height: this.sections().reduce((height, section) => (height + section.height), 0)
    };
  }

  sections () {
    const uids: SectionUid[] = Array.of(
      this.state.sections.headers,
      this.state.sections.details,
      this.state.sections.footers
    ).flat();
    return uids.map(uid => this.findSection(uid));
  }

  findSection (uid: SectionUid): AnySection {
    const section = this.state.entities.sections[uid];
    if (!section) throw new Error(`Section(${uid}) is not found`);
    return section;
  }

  findStackViewRow (uid: StackViewRowUid): StackViewRow {
    const row = this.state.entities.stackViewRows[uid];
    if (!row) throw new Error(`StackViewRow(${uid}) is not found`);
    return row;
  }

  findItem<T extends ItemType | undefined> (uid: ItemUid, itemType?: T): TypeDetectedItem<T> {
    const item = this.state.entities.items[uid];

    if (!item) throw new Error(`Item(${uid}) is not found`);
    if (itemType && item.type !== itemType) throw new Error(`Item(${uid})(type:${itemType}) is not found`);

    return item as TypeDetectedItem<T>;
  }

  findGraphicItem (uid: ItemUid): GraphicItem {
    const item = this.findItem(uid);

    if (item.type === 'stack-view') {
      throw new Error(`Item#${uid} is a StackViewItem but not GraphicItem`);
    } else {
      return item;
    }
  }

  // item の bounds を BoundingPoints に統一したら不要になる
  itemBounds (uid: ItemUid): BoundingPoints {
    const item = this.findItem(uid);

    switch (item.type) {
      case 'ellipse':
        return {
          x1: calcMinus(item.cx, item.rx),
          y1: calcMinus(item.cy, item.ry),
          x2: calcPlus(item.cx, item.rx),
          y2: calcPlus(item.cy, item.ry)
        };
      case 'line':
        return {
          x1: item.x1,
          y1: item.y1,
          x2: item.x2,
          y2: item.y2
        };
      case 'stack-view':
        return {
          x1: item.x,
          y1: item.y,
          x2: calcPlus(item.x, item.width),
          y2: calcPlus(item.y, this.heightOfStackView(uid))
        };
      default:
        return {
          x1: item.x,
          y1: item.y,
          x2: calcPlus(item.x, item.width),
          y2: calcPlus(item.y, item.height)
        };
    }
  }

  isActiveSection (uid: SectionUid): boolean {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'section') return false;

    return this.state.activeEntity.uid === uid;
  }

  isActiveStackViewRow (uid: StackViewRowUid): boolean {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'stack-view-row') return false;

    return this.state.activeEntity.uid === uid;
  }

  isActiveItem (uid: ItemUid): boolean {
    if (!this.state.activeEntity || this.state.activeEntity.type !== 'item') return false;

    return this.state.activeEntity.uid === uid;
  }

  isActiveStackViewRowTree (uid: StackViewRowUid) {
    if (!this.state.activeEntity) return false;

    if (this.isActiveStackViewRow(uid)) return true;

    if (this.state.activeEntity.type === 'item') {
      const row = this.findStackViewRow(uid);
      return row.items.includes(this.state.activeEntity.uid);
    }

    return false;
  }

  isStackViewDecendantActive (uid: ItemUid) {
    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'stack-view') return false;

    return item.rows.some(uid => this.isActiveStackViewRowTree(uid));
  }

  isActiveStackViewTree (uid: ItemUid) {
    if (!this.state.activeEntity) return false;

    const item = this.state.entities.items[uid];
    if (!item || item.type !== 'stack-view') return false;

    return this.isActiveItem(uid) || this.isStackViewDecendantActive(uid);
  }

  heightOfStackView (uid: ItemUid): number {
    const stackView = this.findItem(uid);
    if (stackView.type !== 'stack-view') throw new Error(`StackView(${uid}) is not found`);

    return stackView.rows.reduce((h, rowUid) => h + this.findStackViewRow(rowUid).height, 0);
  }

  activeSection (): AnySection | null {
    if (this.state.activeEntity && this.state.activeEntity.type === 'section') {
      return this.findSection(this.state.activeEntity.uid);
    } else {
      return null;
    }
  };

  activeItem (): AnyItem | null {
    if (this.state.activeEntity && this.state.activeEntity.type === 'item') {
      return this.findItem(this.state.activeEntity.uid);
    } else {
      return null;
    }
  }

  activeStackViewRow (): StackViewRow | null {
    if (this.state.activeEntity && this.state.activeEntity.type === 'stack-view-row') {
      return this.findStackViewRow(this.state.activeEntity.uid);
    } else {
      return null;
    }
  }

  activeEntityExists (): boolean {
    return this.state.activeEntity !== null;
  }

  activeStackView (): StackViewItem | null {
    const activeEntity = this.state.activeEntity;
    if (activeEntity === null) return null;
    if (activeEntity.type !== 'item' && activeEntity.type !== 'stack-view-row') return null;

    const stackViews = Object.values(this.state.entities.items).filter((item): item is StackViewItem => item!.type === 'stack-view');

    if (activeEntity.type === 'item') {
      return stackViews.find(stackView => this.isActiveStackViewTree(stackView.uid)) || null;
    } else {
      return stackViews.find(stackView => stackView.rows.includes(activeEntity.uid)) || null;
    }
  }

  activeOrFirstCanvas (): { type: CanvasType; uid: CanvasUid } | null {
    const activeSection = this.activeSection();
    if (activeSection) {
      return {
        type: 'section',
        uid: activeSection.uid
      };
    }

    const activeStackVieiwRow = this.activeStackViewRow();
    if (activeStackVieiwRow) {
      return {
        type: 'stack-view-row',
        uid: activeStackVieiwRow.uid
      };
    }

    const sections = this.sections();
    if (sections.length) {
      return {
        type: 'section',
        uid: sections[0].uid
      };
    }

    return null;
  }

  copiedItem (uid: ItemUid): CopiedAnyItem {
    const fromItem = this.findItem(uid);

    if (fromItem.type !== 'stack-view') {
      return this.copiedGraphicItem(uid);
    } else {
      return this.copiedStackViewItem(uid);
    }
  }

  copiedGraphicItem (uid: ItemUid): CopiedGraphicItem {
    const fromItem = this.findItem(uid);

    if (fromItem.type === 'stack-view') throw new Error(`GraphicItem(${uid}) is not found`);

    const item = _cloneDeep(fromItem);
    delete item.uid;
    return item;
  }

  copiedStackViewItem (uid: ItemUid): CopiedStackViewItem {
    const fromItem = this.findItem(uid);

    if (fromItem.type !== 'stack-view') throw new Error(`StackView(${uid}) is not found`);

    const item = _cloneDeep(fromItem);
    delete item.uid;

    return {
      ...item,
      rows: item.rows.map(uid => this.copiedStackViewRow(uid))
    };
  }

  copiedStackViewRow (uid: StackViewRowUid): CopiedStackViewRow {
    const row = _cloneDeep(this.findStackViewRow(uid));

    delete row.uid;

    return {
      ...row,
      items: row.items.map(uid => this.copiedGraphicItem(uid))
    };
  }
}
