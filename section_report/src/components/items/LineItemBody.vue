<template>
  <line
    :x1="item.x1"
    :y1="item.y1"
    :x2="item.x2"
    :y2="item.y2"
    :style="style"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { LineItem } from '@/types';

type Style = {
  strokeWidth: number;
  stroke: string;
  strokeDasharray: 'none' | '2,2' | '1,1';
};

const STROKE_DASHARRAY_MAP = {
  solid: 'none',
  dashed: '2,2',
  dotted: '1,1'
} as const;

export default Vue.extend({
  name: 'LineItemBody',
  props: {
    item: {
      type: Object as PropType<LineItem>,
      required: true
    }
  },
  computed: {
    style (): Style {
      return {
        strokeWidth: this.item.style.borderWidth,
        stroke: this.item.style.borderColor,
        strokeDasharray: STROKE_DASHARRAY_MAP[this.item.style.borderStyle]
      };
    }
  }
});
</script>
