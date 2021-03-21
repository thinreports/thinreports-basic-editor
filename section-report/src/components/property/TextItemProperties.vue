<template>
  <div>
    <PropertyCaption caption="Text" />
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
    <TextProperty
      :value="text"
      @change="updateTexts"
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
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import PropertyCaption from './PropertyCaption.vue';
import AffectBottomMarginProperty from './properties/AffectBottomMarginProperty.vue';
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
import TextProperty from './properties/TextProperty.vue';
import TopProperty from './properties/TopProperty.vue';
import VerticalAlignProperty from './properties/VerticalAlignProperty.vue';
import WidthProperty from './properties/WidthProperty.vue';
import { report } from '@/store';
import { TextItem, BuiltinFontFamily, ItemTextStyle } from '@/types';

export default Vue.extend({
  name: 'TextItemProperties',
  components: {
    DisplayProperty,
    IdProperty,
    DescriptionProperty,
    FollowStretchProperty,
    HeightProperty,
    WidthProperty,
    LeftProperty,
    TopProperty,
    TextProperty,
    FontColorProperty,
    FontSizeProperty,
    FontFamilyProperty,
    HorizontalAlignProperty,
    VerticalAlignProperty,
    KerningProperty,
    LineHeightRatioProperty,
    FontStyleBoldProperty,
    FontStyleItalicProperty,
    FontStyleUnderlineProperty,
    FontStyleLinethroughProperty,
    PropertyCaption,
    AffectBottomMarginProperty
  },
  props: {
    item: {
      type: Object as PropType<TextItem>,
      required: true
    }
  },
  computed: {
    text () {
      return this.item.texts.join('\n');
    },
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
      report.actions.updateTextItem({ uid: this.item.uid, key: 'id', value });
    },
    updateDescription (value: string) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'description', value });
    },
    updateDisplay (value: boolean) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'display', value });
    },
    updateHeight (value: string) {
      report.actions.updateTextItemWith(this.item.uid, item => {
        item.height = Number(value);
      });
    },
    updateWidth (value: string) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'width', value: Number(value) });
    },
    updateX (value: string) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'x', value: Number(value) });
    },
    updateY (value: string) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'y', value: Number(value) });
    },
    updateFollowStretch (value: TextItem['followStretch']) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'followStretch', value });
    },
    updateAffectBottomMargin (value: boolean) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'affectBottomMargin', value });
    },
    updateTexts (value: string) {
      report.actions.updateTextItemWith(this.item.uid, item => {
        item.texts = value.split('\n');
      });
    },
    updateColor (value: string) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, color: value } });
    },
    updateFontSize (value: string) {
      report.actions.updateTextItemWith(this.item.uid, item => {
        item.fontSize = Number(value);
      });
    },
    updateFontFamily (value: BuiltinFontFamily) {
      report.actions.updateTextItemWith(this.item.uid, item => {
        item.fontFamily = value;
      });
    },
    updateTextAlign (value: ItemTextStyle['textAlign']) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, textAlign: value } });
    },
    updateVerticalAlign (value: ItemTextStyle['verticalAlign']) {
      report.actions.updateTextItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, verticalAlign: value } });
    },
    updateLineHeightRatio (value: string) {
      report.actions.updateTextItemWith(this.item.uid, item => {
        item.lineHeightRatio = value !== '' ? Number(value) : '';
      });
    },
    updateLetterSpacing (value: string) {
      const letterSpacing = value !== '' ? Number(value) : '';
      report.actions.updateTextItem({ uid: this.item.uid, key: 'style', value: { ...this.item.style, letterSpacing } });
    },
    updateBold (value: boolean) {
      report.actions.updateTextItemWith(this.item.uid, item => { item.bold = value; });
    },
    updateItalic (value: boolean) {
      report.actions.updateTextItemWith(this.item.uid, item => { item.italic = value; });
    },
    updateUnderline (value: boolean) {
      report.actions.updateTextItemWith(this.item.uid, item => { item.underline = value; });
    },
    updateLinethrough (value: boolean) {
      report.actions.updateTextItemWith(this.item.uid, item => { item.linethrough = value; });
    }
  }
});
</script>

<style scoped></style>
