<template>
  <rect
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :stroke-width="strokeWidth"
    :rx="radius"
    :ry="radius"
    class="th-box-item-highlighter"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { calcMinus, calcPlus, calcMul, calcDiv } from '../../lib/strict-calculator';
import { editor } from '../../store';
import { BoundingBox } from '@/types';

export default Vue.extend({
  name: 'BoxItemHighlighter',
  props: {
    itemBounds: {
      type: Object as PropType<BoundingBox>,
      required: true
    },
    itemStrokeWidth: {
      type: Number,
      default: 0
    },
    itemBorderRadius: {
      type: Number,
      default: 0
    }
  },
  computed: {
    x (): number {
      return calcMinus(this.itemBounds.x, this.extraSize);
    },
    y (): number {
      return calcMinus(this.itemBounds.y, this.extraSize);
    },
    width (): number {
      return calcPlus(this.itemBounds.width, calcMul(this.extraSize, 2));
    },
    height (): number {
      return calcPlus(this.itemBounds.height, calcMul(this.extraSize, 2));
    },
    strokeWidth (): number {
      return inverseScale(3, editor.getters.zoomRate());
    },
    extraSize (): number {
      return calcPlus(calcDiv(this.itemStrokeWidth, 2), calcDiv(this.strokeWidth, 2));
    },
    radius (): number {
      return this.itemBorderRadius !== 0 ? this.itemBorderRadius + 1 : 0;
    }
  }
});
</script>

<style scoped>
.th-box-item-highlighter {
  stroke: var(--th-active-color);
  stroke-linecap: square;
  stroke-linejoin: round;
  stroke-opacity: 0.4;
  fill: none;
}
</style>
