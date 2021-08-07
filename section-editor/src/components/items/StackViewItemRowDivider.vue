<template>
  <line
    :x1="x1"
    :y1="y1"
    :x2="x2"
    :y2="y2"
    :stroke-width="strokeWidth"
    class="th-stack-view-row-divider"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { calcPlus } from '../../lib/strict-calculator';
import { inverseScale } from '@/lib/inverse-scale';
import { editor } from '@/store';

export default Vue.extend({
  name: 'StackViewItemRoweDivider',
  props: {
    top: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  computed: {
    x1 (): number {
      return this.left;
    },
    y1 (): number {
      return this.top;
    },
    x2 (): number {
      return calcPlus(this.left, this.width);
    },
    y2 (): number {
      return this.top;
    },
    strokeWidth (): number {
      return inverseScale(1, editor.getters.zoomRate());
    }
  }
});
</script>

<style scoped>
.th-stack-view-row-divider {
  stroke: #e0e0e0;
}
</style>
