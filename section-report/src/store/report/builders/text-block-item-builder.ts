import _cloneDeep from 'lodash.clonedeep';
import { ValuesType } from 'utility-types';
import { TextBlockItem, TextItemStyle } from '@/types';

export default class TextBlockItemBuilder {
  private entity: TextBlockItem;
  private style: TextItemStyle;

  constructor (entity: Readonly<TextBlockItem>) {
    this.entity = _cloneDeep(entity);
    this.style = this.entity.style;
  }

  build (): TextBlockItem {
    this.finalize();
    return this.entity;
  }

  set bold (enable: boolean) {
    this.updateFontStyle('bold', enable);
  }

  set italic (enable: boolean) {
    this.updateFontStyle('italic', enable);
  }

  set underline (enable: boolean) {
    this.updateFontStyle('underline', enable);
  }

  set linethrough (enable: boolean) {
    this.updateFontStyle('linethrough', enable);
  }

  private finalize () {
    Object.freeze(this.entity);
  }

  // FIXME: Implement it in the base class or as a utility to make it DRY
  private updateFontStyle<S extends ValuesType<TextItemStyle['fontStyle']>> (style: S, enable: boolean) {
    const fontStyle = [...this.style.fontStyle];
    if (enable) {
      fontStyle.push(style);
    } else {
      fontStyle.splice(fontStyle.indexOf(style), 1);
    }
    this.style.fontStyle = fontStyle;
  }
}
