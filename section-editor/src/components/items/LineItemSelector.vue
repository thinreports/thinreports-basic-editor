<template>
  <line
    :x1="item.x1"
    :y1="item.y1"
    :x2="item.x2"
    :y2="item.y2"
    :stroke-width="strokeWidth"
    class="selector"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';
import { LineItem } from '@/types';

export default Vue.extend({
  name: 'LineItemSelector',
  props: {
    item: {
      type: Object as PropType<LineItem>,
      required: true
    }
  },
  computed: {
    strokeWidth (): number {
      return inverseScale(10, editor.getters.zoomRate());
    }
  }
});
</script>

<style scoped>
.selector {
  stroke: #ffffff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-opacity: 0;
}
</style>
