import _cloneDeep from 'lodash.clonedeep';
import { DeepReadonly } from 'utility-types';
import { deepChangeToKebabCase } from '@/lib/deep-change-case';
import { Report, SectionUid, ItemUid, StackViewItem, StackViewRowUid, GraphicItem, AnyUid, TextItem } from '@/types';
import { SCHEMA_VERSION, EDITOR_VERSION } from '@/versions';

class EntityNotFoundError extends Error {
  constructor (type: string, uid: AnyUid) {
    super(`${type}(${uid}) is not found.`);
    this.name = 'EntityNotFoundError';
  }
}

class SchemaEncoder {
  private state: DeepReadonly<Report>;

  constructor (state: DeepReadonly<Report>) {
    this.state = state;
  }

  encode (): DeepReadonly<LayoutSchema> {
    return {
      schemaVersion: SCHEMA_VERSION,
      lastModifiedBy: EDITOR_VERSION,
      title: this.state.title,
      report: {
        orientation: this.state.orientation,
        paperType: this.state.paperType,
        width: this.state.width,
        height: this.state.height,
        margin: this.state.margin
      },
      sections: [
        ...this.sections(this.state.sections.headers),
        ...this.sections(this.state.sections.details),
        ...this.sections(this.state.sections.footers)
      ],
      state: {
        layoutGuides: this.state.layoutGuides
      }
    };
  }

  sections (sectionUids: DeepReadonly<SectionUid[]>): DeepReadonly<AnySectionSchema[]> {
    return sectionUids.map(uid => this.section(uid));
  }

  section (sectionUid: DeepReadonly<SectionUid>): DeepReadonly<AnySectionSchema> {
    const section = this.state.entities.sections[sectionUid];
    if (!section) throw new EntityNotFoundError('section', sectionUid);

    const { uid, items, ...attributes } = section;
    return {
      ...attributes,
      items: this.items(items)
    };
  }

  items (itemUids: DeepReadonly<ItemUid[]>): DeepReadonly<AnyItemSchema[]> {
    return itemUids.map(itemUid => {
      const item = this.state.entities.items[itemUid];
      if (!item) throw new EntityNotFoundError('item', itemUid);

      if (item.type === 'stack-view') {
        return this.stackViewItem(item);
      } else {
        return this.item(item);
      }
    });
  }

  graphicItems (itemUids: DeepReadonly<ItemUid[]>): DeepReadonly<GraphicItemSchema[]> {
    return itemUids.map(itemUid => {
      const item = this.state.entities.items[itemUid];
      if (!item || item.type === 'stack-view') throw new EntityNotFoundError('item', itemUid);

      return this.item(item);
    });
  }

  item (item: DeepReadonly<GraphicItem>): DeepReadonly<GraphicItemSchema> {
    if (item.type === 'text') {
      return this.textItem(item);
    } else {
      const { uid, ...attributes } = item;
      return attributes;
    }
  }

  textItem (item: DeepReadonly<TextItem>): DeepReadonly<TextItemSchema> {
    const { uid, contentHeight, ...schemaAttributes } = item;
    return schemaAttributes;
  }

  stackViewItem (stackView: DeepReadonly<StackViewItem>): DeepReadonly<StackViewItemSchema> {
    const { uid, rows, ...attributes } = stackView;
    return {
      ...attributes,
      rows: this.stackViewItemRows(rows)
    };
  }

  stackViewItemRows (rowUids: DeepReadonly<StackViewRowUid[]>): DeepReadonly<StackViewRowSchema[]> {
    return rowUids.map(rowUid => {
      const row = this.state.entities.stackViewRows[rowUid];
      if (!row) throw new EntityNotFoundError('stack-view-row', rowUid);

      const { uid, items, ...attributes } = row;
      return {
        ...attributes,
        items: this.graphicItems(items)
      };
    });
  }
}

export default (state: Report) => {
  const encoder = new SchemaEncoder(_cloneDeep(state));
  return deepChangeToKebabCase(encoder.encode());
};
