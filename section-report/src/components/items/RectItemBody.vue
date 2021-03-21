<template>
  <rect
    :x="item.x"
    :y="item.y"
    :width="item.width"
    :height="item.height"
    :style="style"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { RectItem } from '@/types';

type Style = {
  strokeWidth: number;
  stroke: string;
  fill: string;
  rx: number;
  ry: number;
  strokeDasharray: 'none' | '2,2' | '1,1';
};

const STROKE_DASHARRAY_MAP = {
  solid: 'none',
  dashed: '2,2',
  dotted: '1,1'
} as const;

export default Vue.extend({
  name: 'RectItemBody',
  props: {
    item: {
      type: Object as PropType<RectItem>,
      required: true
    }
  },
  computed: {
    style (): Style {
      return {
        strokeWidth: this.item.style.borderWidth,
        stroke: this.item.style.borderColor,
        fill: this.item.style.fillColor,
        strokeDasharray: STROKE_DASHARRAY_MAP[this.item.style.borderStyle],
        rx: this.item.borderRadius,
        ry: this.item.borderRadius
      };
    }
  }
});
</script>
