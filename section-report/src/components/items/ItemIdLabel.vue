<template>
  <text
    :x="x"
    :y="y"
    :dx="left"
    :font-size="fontSize"
    dominant-baseline="text-before-edge"
    class="th-id-label"
    v-text="label"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';

export default Vue.extend({
  name: 'ItemIdLabel',
  props: {
    label: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  computed: {
    zoomRate: () => editor.getters.zoomRate(),
    fontSize (): number {
      return inverseScale(10, this.zoomRate);
    },
    left (): number {
      return inverseScale(3, this.zoomRate);
    }
  }
});
</script>

<style scoped>
.th-id-label {
  pointer-events: none;
  fill: var(--th-active-color);
}
</style>
