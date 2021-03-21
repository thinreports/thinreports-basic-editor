<template>
  <rect
    x="0"
    y="0"
    :width="width"
    :height="height"
    class="th-canvas-drawer"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  />
</template>

<script lang="ts">
import Vue from 'vue';

type Data = {
  pointerDown: boolean;
};

export default Vue.extend({
  name: 'CanvasDrawer',
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      pointerDown: false
    };
  },
  methods: {
    emitStartDraw () {
      this.$emit('startDraw');
    },
    onPointerDown () {
      this.pointerDown = true;
    },
    onPointerMove () {
      if (this.pointerDown) {
        this.emitStartDraw();
        this.pointerDown = false;
      }
    },
    onPointerUp () {
      this.pointerDown = false;
    }
  }
});
</script>

<style scoped>
.th-canvas-drawer {
  fill: #ffffff;
  stroke: none;
  fill-opacity: 0;
  cursor: crosshair;
}
</style>
