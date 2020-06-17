<template>
  <line
    x1="-1"
    y1="0"
    x2="-1"
    :y2="height"
    :stroke="strokeWidth"
    class="th-stack-view-row-highlighter"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { inverseScale } from '@/lib/inverse-scale';
import { editor } from '@/store';

export default Vue.extend({
  name: 'StackViewItemRowHighlighter',
  props: {
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    strokeWidth (): number {
      return inverseScale(1, editor.getters.zoomRate());
    }
  }
});
</script>

<style scoped>
.th-stack-view-row-highlighter {
  stroke: var(--th-active-color);
}
</style>
