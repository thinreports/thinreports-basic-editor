<template>
  <line
    x1="0"
    y1="0"
    x2="0"
    :y2="height"
    :stroke="strokeWidth"
    class="th-section-highlighter"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { inverseScale } from '../lib/inverse-scale';
import { editor } from '../store';

export default Vue.extend({
  name: 'SectionCanvasHighlighter',
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
.th-section-highlighter {
  stroke: var(--th-active-color);
}
</style>
