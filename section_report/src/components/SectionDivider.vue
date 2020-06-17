<template>
  <line
    x1="0"
    :y1="top"
    :x2="width"
    :y2="top"
    :stroke-width="strokeWidth"
    class="th-section-divider"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { inverseScale } from '../lib/inverse-scale';
import { editor } from '../store';

export default Vue.extend({
  name: 'SectionDivider',
  props: {
    top: {
      type: Number,
      required: true
    },
    width: {
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
.th-section-divider {
  stroke: #e0e0e0;
}
</style>
