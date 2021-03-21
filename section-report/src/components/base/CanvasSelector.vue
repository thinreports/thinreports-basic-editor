<template>
  <rect
    :x="bounds.x"
    :y="bounds.y"
    :width="bounds.width"
    :height="bounds.height"
    class="th-canvas-selector"
    @pointerdown="emitSelect"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BoundingBox } from '@/types';

export default Vue.extend({
  name: 'CanvasSelector',
  props: {
    bounds: {
      type: Object as PropType<BoundingBox>,
      required: true
    }
  },
  methods: {
    emitSelect () {
      this.$emit('select');
    }
  }
});
</script>

<style scoped>
.th-canvas-selector {
  fill: #ffffff;
  stroke: none;
  fill-opacity: 0;
}
</style>
