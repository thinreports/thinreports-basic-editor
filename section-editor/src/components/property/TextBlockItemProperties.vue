<template>
  <div>
    <PropertyCaption caption="TextBlock" />
    <IdProperty
      :value="item.id"
      @change="updateId"
    />
    <DisplayProperty
      :value="item.display"
      @change="updateDisplay"
    />
    <DescriptionProperty
      :value="item.description"
      @change="updateDescription"
    />
    <HeightProperty
      :value="item.height"
      @change="updateHeight"
    />
    <WidthProperty
      :value="item.width"
      @change="updateWidth"
    />
    <LeftProperty
      :value="item.x"
      @change="updateX"
    />
    <TopProperty
      :value="item.y"
      @change="updateY"
    />
    <FollowStretchProperty
      :value="item.followStretch"
      @change="updateFollowStretch"
    />
    <AffectBottomMarginProperty
      :value="item.affectBottomMargin"
      @change="updateAffectBottomMargin"
    />
    <MultipleLineProperty
      :value="item.multipleLine"
      @change="updateMultipleLine"
    />
    <FontColorProperty
      :value="item.style.color"
      @change="updateColor"
    />
    <FontSizeProperty
      :value="item.style.fontSize"
      @change="updateFontSize"
    />
    <FontFamilyProperty
      :value="item.style.fontFamily[0]"
      @change="updateFontFamily"
    />
    <FontStyleBoldProperty
      :value="isBold"
      @change="updateBold"
    />
    <FontStyleItalicProperty
      :value="isItalic"
      @change="updateItalic"
    />
    <FontStyleUnderlineProperty
      :value="isUnderline"
      @change="updateUnderline"
    />
    <FontStyleLinethroughProperty
      :value="isLinethrough"
      @change="updateLinethrough"
    />
    <HorizontalAlignProperty
      :value="item.style.textAlign"
      @change="updateTextAlign"
    />
    <VerticalAlignProperty
      :value="item.style.verticalAlign"
      @change="updateVerticalAlign"
    />
    <LineHeightRatioProperty
      :value="item.style.lineHeightRatio"
      @change="updateLineHeightRatio"
    />
    <KerningProperty
      :value="item.style.letterSpacing"
      @change="updateLetterSpacing"
    />
    <BasicFormatProperty
      :value="item.format.base"
      @change="updateBasicFormat"
    />
    <DefaultTextProperty
      :value="item.value"
      @change="updateDefaultValue"
    />
    <OverflowProperty
      :value="item.style.overflow"
      @change="updateOverflow"
    />
    <WordWrapProperty
      :value="item.style.wordWrap"
      @change="updateWordWrap"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
import BasicFormatProperty from './properties/BasicFormatProperty.vue';
import DefaultTextProperty from './properties/DefaultTextProperty.vue';
import DescriptionProperty from './properties/DescriptionProperty.vue';
import DisplayProperty from './properties/DisplayProperty.vue';
import FollowStretchProperty from './properties/FollowStretchProperty.vue';
import FontColorProperty from './properties/FontColorProperty.vue';
import FontFamilyProperty from './properties/FontFamilyProperty.vue';
import FontSizeProperty from './properties/FontSizeProperty.vue';
import FontStyleBoldProperty from './properties/FontStyleBoldProperty.vue';
import FontStyleItalicProperty from './properties/FontStyleItalicProperty.vue';
import FontStyleLinethroughProperty from './properties/FontStyleLinethroughProperty.vue';
import FontStyleUnderlineProperty from './properties/FontStyleUnderlineProperty.vue';
import HeightProperty from './properties/HeightProperty.vue';
import HorizontalAlignProperty from './properties/HorizontalAlignProperty.vue';
import IdProperty from './properties/IdProperty.vue';
import KerningProperty from './properties/KerningProperty.vue';
import LeftProperty from './properties/LeftProperty.vue';
import LineHeightRatioProperty from './properties/LineHeightRatioProperty.vue';
import MultipleLineProperty from './properties/MultipleLineProperty.vue';
import OverflowProperty from './properties/OverflowProperty.vue';
import TopProperty from './properties/TopProperty.vue';
import VerticalAlignProperty from './properties/VerticalAlignProperty.vue';
import WidthProperty from './properties/WidthProperty.vue';
import WordWrapProperty from './properties/WordWrapProperty.vue';
import { report } from '@/store';
import { TextBlockItem, BuiltinFontFamily, ItemTextStyle, TextOverflowStyle, TextWordWrapStyle } from '@/types';

export default Vue.extend({
  name: 'TextBlockItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    FontColorProperty,
    FontSizeProperty,
    FontFamilyProperty,
    HorizontalAlignProperty,
    VerticalAlignProperty,
    KerningProperty,
    LineHeightRatioProperty,
    BasicFormatProperty,
    DefaultTextProperty,
    OverflowProperty,
    WordWrapProperty,
    MultipleLineProperty,
    FontStyleBoldProperty,
    FontStyleItalicProperty,
    FontStyleUnderlineProperty,
    FontStyleLinethroughProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<TextBlockItem>,
      required: true
    }
  },
  computed: {
    isBold () {
      return this.item.style.fontStyle.includes('bold');
    },
    isItalic () {
      return this.item.style.fontStyle.includes('italic');
    },
    isUnderline () {
      return this.item.style.fontStyle.includes('underline');
    },
    isLinethrough () {
      return this.item.style.fontStyle.includes('linethrough');
    }
  },
  methods: {
    updateId (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'display', value });
    },
    updateHeight (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'height', value: Number(value) });
    },
    updateWidth (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'width', value: Number(value) });
    },
    updateX (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'x', value: Number(value) });
    },
    updateY (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'y', value: Number(value) });
    },
    updateFollowStretch (value: TextBlockItem['followStretch']) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateColor (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, color: value } });
    },
    updateFontSize (value: string) {
      report.actions.updateTextFontAndLineSize({ uid: this.item.uid, fontSize: Number(value), lineHeightRatio: this.item.style.lineHeightRatio });
    },
    updateFontFamily (value: BuiltinFontFamily) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, fontFamily: [value] } });
    },
    updateTextAlign (value: ItemTextStyle['textAlign']) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, textAlign: value } });
    },
    updateVerticalAlign (value: ItemTextStyle['verticalAlign']) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, verticalAlign: value } });
    },
    updateLineHeightRatio (value: string) {
      const lineHeightRatio = value !== '' ? Number(value) : '';
      report.actions.updateTextFontAndLineSize({ uid: this.item.uid, fontSize: this.item.style.fontSize, lineHeightRatio });
    },
    updateLetterSpacing (value: string) {
      const letterSpacing = value !== '' ? Number(value) : '';
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, letterSpacing } });
    },
    updateBasicFormat (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'format', value: { ...this.item.format, base: value } });
    },
    updateDefaultValue (value: string) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'value', value });
    },
    updateOverflow (value: TextOverflowStyle) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, overflow: value } });
    },
    updateWordWrap (value: TextWordWrapStyle) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, wordWrap: value } });
    },
    updateMultipleLine (value: boolean) {
      report.actions.updateTextBlockItem({ uid: this.item.uid, key: 'multipleLine', value });
    },
    updateBold (value: boolean) {
      report.actions.updateTextBlockItemWith(this.item.uid, item => { item.bold = value; });
    },
    updateItalic (value: boolean) {
      report.actions.updateTextBlockItemWith(this.item.uid, item => { item.italic = value; });
    },
    updateUnderline (value: boolean) {
      report.actions.updateTextBlockItemWith(this.item.uid, item => { item.underline = value; });
    },
    updateLinethrough (value: boolean) {
      report.actions.updateTextBlockItemWith(this.item.uid, item => { item.linethrough = value; });
    }
  }
});
</script>

<style scoped></style>
