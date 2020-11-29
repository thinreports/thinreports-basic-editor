import _cloneDeep from 'lodash.clonedeep';
import { ValuesType } from 'utility-types';
import { round } from '@/lib/round-float-values';
import { calcPlus, calcMul } from '@/lib/strict-calculator';
import { computeTextLineHeight } from '@/store/lib/text-font-and-line-size';
import { TextItem, TextItemStyle, BuiltinFontFamily } from '@/types';

export const computeContentHeight = ({ texts, fontSize, lineHeight }: {
  texts: TextItem['texts'];
  fontSize: TextItemStyle['fontSize'];
  lineHeight: TextItemStyle['lineHeight'];
}): TextItem['contentHeight'] => {
  if (texts.length === 0) {
    return 0;
  } else {
    return calcPlus(calcMul(lineHeight, texts.length - 1), fontSize);
  }
};

export default class TextItemBuilder {
  private entity: TextItem;
  private style: TextItemStyle;

  constructor (entity: Readonly<TextItem>) {
    this.entity = _cloneDeep(entity);
    this.style = this.entity.style;
  }

  build (): TextItem {
    this.finalize();
    return this.entity;
  }

  set height (height: TextItem['height']) {
    this.entity.height = round(height);
  }

  set fontFamily (family: BuiltinFontFamily) {
    this.style.fontFamily = [family];
  }

  set fontSize (size: TextItemStyle['fontSize']) {
    this.style.fontSize = round(size, 1);
  }

  set texts (texts: TextItem['texts']) {
    this.entity.texts = texts;
  }

  set lineHeightRatio (ratio: TextItemStyle['lineHeightRatio']) {
    this.style.lineHeightRatio = ratio !== '' ? round(ratio) : '';
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
    this.finalizeDemensions();

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

  private finalizeDemensions () {
    this.style.lineHeight = computeTextLineHeight({
      fontSize: this.style.fontSize,
      lineHeightRatio: this.style.lineHeightRatio
    });
    this.entity.contentHeight = computeContentHeight({
      texts: this.entity.texts,
      fontSize: this.style.fontSize,
      lineHeight: this.style.lineHeight
    });
    this.entity.height = Math.max(this.entity.contentHeight, this.entity.height);
  }
}
