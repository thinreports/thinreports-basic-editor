<template>
  <ellipse
    :cx="item.cx"
    :cy="item.cy"
    :rx="item.rx"
    :ry="item.ry"
    :style="style"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { EllipseItem } from '@/types';

type Style = {
  strokeWidth: number;
  stroke: string;
  fill: string;
  strokeDasharray: 'none' | '2,2' | '1,1';
};

const STROKE_DASHARRAY_MAP = {
  solid: 'none',
  dashed: '2,2',
  dotted: '1,1'
} as const;

export default Vue.extend({
  name: 'EllipseItemBody',
  props: {
    item: {
      type: Object as PropType<EllipseItem>,
      required: true
    }
  },
  computed: {
    style (): Style {
      return {
        strokeWidth: this.item.style.borderWidth,
        stroke: this.item.style.borderColor,
        fill: this.item.style.fillColor,
        strokeDasharray: STROKE_DASHARRAY_MAP[this.item.style.borderStyle]
      };
    }
  }
});
</script>
