<template>
  <rect
    :x="bounds.x"
    :y="bounds.y"
    :width="bounds.width"
    :height="bounds.height"
    :stroke-width="strokeWidth"
    class="th-box-item-outline"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';
import { Bounds } from '@/types';

export default Vue.extend({
  name: 'ItemBoundingBoxOutline',
  props: {
    bounds: {
      type: Object as PropType<Bounds>,
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
.th-box-item-outline {
  stroke: #999;
  fill: none;
}
</style>
