<template>
  <g>
    <g ref="box">
      <text
        v-for="(text, index) in item.texts"
        :key="index"
        :x="calculatedX"
        :y="calculateTextLineY(index)"
        :style="textStyle"
        dominant-baseline="text-before-edge"
        class="th-text"
        v-text="text || ' '"
      />
    </g>
    <rect
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
      fill="#ffffff"
      fill-opacity="0"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { calcDiv, calcPlus, calcMul, calcMinus } from '../../lib/strict-calculator';
import { report } from '../../store';
import { TextItem } from '@/types';

type TextStyle = {
  fontSize: string;
  fontFamily: string;
  fill: string;
  fontWeight: 'bold' | 'normal';
  fontStyle: 'italic' | 'normal';
  textDecoration: 'underline' | 'line-through' | 'underline line-through' | 'none';
  letterSpacing: string;
  textAnchor: 'start' | 'middle' | 'end';
};

export default Vue.extend({
  name: 'TextItemBody',
  props: {
    item: {
      type: Object as PropType<TextItem>,
      required: true
    }
  },
  computed: {
    textStyle (): TextStyle {
      return {
        fontSize: `${this.item.style.fontSize}px`,
        fontFamily: this.item.style.fontFamily.join(','),
        fill: this.item.style.color,
        fontWeight: this.fontWeight,
        fontStyle: this.fontStyle,
        textDecoration: this.textDecoration,
        textAnchor: this.textAnchor,
        letterSpacing: this.letterSpacing
      };
    },
    fontWeight (): TextStyle['fontWeight'] {
      return this.item.style.fontStyle.includes('bold') ? 'bold' : 'normal';
    },
    fontStyle (): TextStyle['fontStyle'] {
      return this.item.style.fontStyle.includes('italic') ? 'italic' : 'normal';
    },
    textAnchor (): TextStyle['textAnchor'] {
      switch (this.item.style.textAlign) {
        case 'left': return 'start';
        case 'center': return 'middle';
        case 'right': return 'end';
        default: throw new Error('Invalid text align value');
      }
    },
    textDecoration (): TextStyle['textDecoration'] {
      const fontStyles = this.item.style.fontStyle;

      if (fontStyles.includes('underline') && fontStyles.includes('linethrough')) {
        return 'underline line-through';
      } else if (fontStyles.includes('underline')) {
        return 'underline';
      } else if (fontStyles.includes('linethrough')) {
        return 'line-through';
      } else {
        return 'none';
      }
    },
    letterSpacing (): TextStyle['letterSpacing'] {
      return this.item.style.letterSpacing !== '' ? `${this.item.style.letterSpacing}px` : 'normal';
    },
    calculatedX (): number {
      switch (this.textAnchor) {
        case 'start': return this.item.x;
        case 'middle': return calcPlus(this.item.x, calcDiv(this.item.width, 2));
        case 'end': return calcPlus(this.item.x, this.item.width);
        default: throw new Error('Invalid text align value');
      }
    },
    calculatedY (): number {
      switch (this.item.style.verticalAlign) {
        case 'top': return this.item.y;
        case 'middle': return calcPlus(this.item.y, calcDiv(calcMinus(this.item.height, this.item.contentHeight), 2));
        case 'bottom': return calcMinus(calcPlus(this.item.y, this.item.height), this.item.contentHeight);
        default: throw new Error('Invalid vertical align value');
      }
    }
  },
  watch: {
    item: {
      handler (newItem: TextItem, oldItem: TextItem) {
        if (this.isAdjustingBoxWidthRequired(newItem, oldItem)) {
          this.$nextTick(() => this.adjustBoxWidth());
        }
      },
      deep: true
    }
  },
  methods: {
    calculateTextLineY (index: number) {
      return calcPlus(this.calculatedY, calcMul(this.item.style.lineHeight, index));
    },
    adjustBoxWidth () {
      const bbox = (this.$refs.box as SVGGElement).getBBox();
      report.actions.adjustTextItemWidth({ uid: this.item.uid, minWidth: bbox.width });
    },
    isAdjustingBoxWidthRequired (item: TextItem, prevItem: TextItem): boolean {
      const itemStyle = item.style;
      const prevItemStyle = prevItem.style;

      return (
        item.width !== prevItem.width ||
        itemStyle.fontSize !== prevItemStyle.fontSize ||
        itemStyle.fontFamily.join() !== prevItemStyle.fontFamily.join() ||
        itemStyle.fontStyle.join() !== prevItemStyle.fontStyle.join() ||
        item.texts.join() !== prevItem.texts.join() ||
        itemStyle.letterSpacing !== prevItemStyle.letterSpacing
      );
    }
  }
});
</script>

<style scoped>
.th-text {
  text-rendering: 'geometricPrecision';
  white-space: 'pre';
}
</style>
