<template>
  <svg
    width="1"
    height="1"
    viewbox="0 0 1 1"
    class="th-font-preloader-canvas"
  >
    <text
      v-for="(family, index) in fontFamilies"
      :key="index"
      width="1"
      height="1"
      :font-family="family"
    >
      _
    </text>
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'FontPreloader',
  computed: {
    fontFamilies () {
      return [
        'IPAGothic',
        'IPAPGothic',
        'IPAMincho',
        'IPAPMincho'
      ];
    }
  }
});
</script>

<style scoped>
.th-font-preloader-canvas {
  position: absolute;
  left: -1000px;
  pointer-events: none;
  visibility: hidden;
}
</style>
