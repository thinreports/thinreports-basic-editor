<template>
  <ellipse
    :cx="item.cx"
    :cy="item.cy"
    :rx="rx"
    :ry="ry"
    :stroke-width="strokeWidth"
    class="th-ellipse-highlighter"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { calcDiv, calcPlus } from '../../lib/strict-calculator';
import { editor } from '../../store';
import { EllipseItem } from '@/types';

export default Vue.extend({
  name: 'EllipseItemHeightlighter',
  props: {
    item: {
      type: Object as PropType<EllipseItem>,
      required: true
    }
  },
  computed: {
    rx (): number {
      return calcPlus(this.item.rx, this.extraSize);
    },
    ry (): number {
      return calcPlus(this.item.ry, this.extraSize);
    },
    strokeWidth (): number {
      return inverseScale(3, editor.getters.zoomRate());
    },
    extraSize (): number {
      return calcPlus(calcDiv(this.item.style.borderWidth, 2), calcDiv(this.strokeWidth, 2));
    }
  }
});
</script>

<style scoped>
.th-ellipse-highlighter {
  stroke: var(--th-active-color);
  stroke-linecap: square;
  stroke-linejoin: round;
  stroke-opacity: 0.4;
  fill: none;
}
</style>
