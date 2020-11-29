<template>
  <line
    :x1="boundingPoints.x1"
    :y1="boundingPoints.y1"
    :x2="boundingPoints.x2"
    :y2="boundingPoints.y2"
    :stroke-width="strokeWidth"
    class="th-line-item-outline"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '@/store';
import { BoundingPoints } from '@/types';

export default Vue.extend({
  name: 'LineItemOutline',
  props: {
    boundingPoints: {
      type: Object as PropType<BoundingPoints>,
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
.th-line-item-outline {
  stroke: #999;
}
</style>
