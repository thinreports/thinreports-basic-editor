<template>
  <rect
    :x="bounds.x"
    :y="bounds.y"
    :width="bounds.width"
    :height="bounds.height"
    class="th-stack-view-modifier"
    :stroke-width="frameWidth"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';
import { BoundingBox } from '@/types';

type Data = {
  pointerDown: boolean;
};

export default Vue.extend({
  name: 'StackViewItemModifier',
  props: {
    itemBounds: {
      type: Object as PropType<BoundingBox>,
      required: true
    }
  },
  data (): Data {
    return {
      pointerDown: false
    };
  },
  computed: {
    bounds (): BoundingBox {
      return {
        x: this.itemBounds.x - this.frameWidth / 2,
        y: this.itemBounds.y - this.frameWidth / 2,
        width: this.itemBounds.width + this.frameWidth,
        height: this.itemBounds.height + this.frameWidth
      };
    },
    frameWidth () {
      return inverseScale(10, editor.getters.zoomRate());
    }
  },
  methods: {
    onPointerDown () {
      this.pointerDown = true;
    },
    onPointerMove () {
      if (this.pointerDown) {
        this.emitModifierDrag();
        this.pointerDown = false;
      }
    },
    onPointerUp () {
      if (this.pointerDown) {
        this.emitModifierClick();
      }
      this.pointerDown = false;
    },
    emitModifierClick () {
      this.$emit('modifierClick');
    },
    emitModifierDrag () {
      this.$emit('modifierDrag');
    }
  }
});
</script>

<style scoped>
.th-stack-view-modifier {
  stroke: #cccccc;
  stroke-opacity: 0.7;
  stroke-linecap: square;
  stroke-linejoin: round;
  fill: none;
  cursor: move;
}
</style>
