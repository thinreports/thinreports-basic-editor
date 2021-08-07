<template>
  <line
    :x1="item.x1"
    :y1="item.y1"
    :x2="item.x2"
    :y2="item.y2"
    :stroke-width="strokeWidth"
    class="th-line-highlighter"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';
import { LineItem } from '@/types';

export default Vue.extend({
  name: 'LineItemHeightlighter',
  props: {
    item: {
      type: Object as PropType<LineItem>,
      required: true
    }
  },
  computed: {
    strokeWidth (): number {
      return this.item.style.borderWidth + inverseScale(5, editor.getters.zoomRate());
    }
  }
});
</script>

<style scoped>
.th-line-highlighter {
  stroke: var(--th-active-color);
  stroke-linecap: square;
  stroke-linejoin: round;
  stroke-opacity: 0.4;
  fill: none;
}
</style>
