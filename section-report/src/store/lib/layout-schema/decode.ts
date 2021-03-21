import uuid from 'uuid/v4';
import { deepChangeToCamelCase } from '@/lib/deep-change-case';
import { computeContentHeight } from '@/store/report/builders/text-item-builder';
import { Report, SectionUid, AnySection, AnyItem, ItemUid, StackViewItem, StackViewRowUid, GraphicItem, TextItem } from '@/types';

class SchemaDecoder {
  private layoutSchema: LayoutSchema;

  private itemEntities: Report['entities']['items'];
  private sectionEntities: Report['entities']['sections'];
  private stackViewRowEntities: Report['entities']['stackViewRows'];

  constructor (layoutSchema: LayoutSchema) {
    this.layoutSchema = layoutSchema;

    this.itemEntities = {};
    this.sectionEntities = {};
    this.stackViewRowEntities = {};
  }

  decode (): Omit<Report, 'activeEntity'> {
    const reportSchema = this.layoutSchema.report;

    return {
      type: 'section',
      title: this.layoutSchema.title,
      paperType: reportSchema.paperType,
      width: reportSchema.width,
      height: reportSchema.height,
      orientation: reportSchema.orientation,
      margin: reportSchema.margin,
      sections: this.sections(this.layoutSchema.sections),
      entities: {
        items: this.itemEntities,
        sections: this.sectionEntities,
        stackViewRows: this.stackViewRowEntities
      },
      layoutGuides: this.layoutSchema.state.layoutGuides
    };
  }

  sections (sectionSchemas: AnySectionSchema[]): Report['sections'] {
    const headerUids: SectionUid[] = [];
    const detailUids: SectionUid[] = [];
    const footerUids: SectionUid[] = [];

    sectionSchemas.forEach(sectionSchema => {
      const section = this.section(sectionSchema);

      switch (sectionSchema.type) {
        case 'header':
          headerUids.push(section.uid);
          break;
        case 'detail':
          detailUids.push(section.uid);
          break;
        case 'footer':
          footerUids.push(section.uid);
          break;
      }
      this.sectionEntities[section.uid] = section;
    });

    return {
      headers: headerUids,
      details: detailUids,
      footers: footerUids
    };
  }

  section (sectionSchema: AnySectionSchema): AnySection {
    return {
      uid: uuid() as SectionUid,
      ...sectionSchema,
      items: this.items(sectionSchema.items)
    };
  }

  items (itemSchemas: AnyItemSchema[]): ItemUid[] {
    const itemUids: ItemUid[] = [];

    itemSchemas.forEach(itemSchema => {
      const item: AnyItem = itemSchema.type === 'stack-view'
        ? this.stackViewItem(itemSchema)
        : this.item(itemSchema);

      itemUids.push(item.uid);
      this.itemEntities[item.uid] = item;
    });

    return itemUids;
  }

  item (itemSchema: GraphicItemSchema): GraphicItem {
    if (itemSchema.type === 'text') {
      return this.textItem(itemSchema);
    } else {
      return {
        uid: uuid() as ItemUid,
        ...itemSchema
      };
    }
  }

  textItem (schema: TextItemSchema): TextItem {
    return {
      uid: uuid() as ItemUid,
      ...schema,
      contentHeight: computeContentHeight({
        texts: schema.texts,
        fontSize: schema.style.fontSize,
        lineHeight: schema.style.lineHeight
      })
    };
  }

  stackViewItem (itemSchema: StackViewItemSchema): StackViewItem {
    return {
      uid: uuid() as ItemUid,
      ...itemSchema,
      rows: this.stackViewRows(itemSchema.rows)
    };
  }

  stackViewRows (rowSchemas: StackViewRowSchema[]): StackViewRowUid[] {
    const rowUids: StackViewRowUid[] = [];

    rowSchemas.forEach(rowSchema => {
      const row = {
        uid: uuid() as StackViewRowUid,
        ...rowSchema,
        items: this.items(rowSchema.items)
      };

      rowUids.push(row.uid);
      this.stackViewRowEntities[row.uid] = row;
    });

    return rowUids;
  }
}

export default (schema: unknown) => {
  const layoutSchema = deepChangeToCamelCase(schema) as LayoutSchema;
  const decoder = new SchemaDecoder(layoutSchema);
  return decoder.decode();
};
