<template>
  <g
    :class="['th-item-entity', { 'unselectable': !isSelectMode }]"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { editor } from '../../store';
import { AnyItem } from '@/types';

type Data = {
  pointerDown: boolean;
};

export default Vue.extend({
  name: 'ItemEntity',
  props: {
    item: {
      type: Object as PropType<AnyItem>,
      required: true
    }
  },
  data (): Data {
    return {
      pointerDown: false
    };
  },
  computed: {
    isSelectMode (): boolean {
      return editor.getters.isSelectMode();
    }
  },
  methods: {
    onPointerDown () {
      this.pointerDown = true;
      this.emitItemClick();
    },
    onPointerMove () {
      if (this.pointerDown) {
        this.emitItemDrag();
        this.pointerDown = false;
      }
    },
    onPointerUp () {
      this.pointerDown = false;
    },
    emitItemClick () {
      this.$emit('itemClick');
    },
    emitItemDrag () {
      this.$emit('itemDrag');
    }
  }
});
</script>

<style scoped>
.th-item-entity {
  cursor: move;
}

.th-item-entity.unselectable {
  pointer-events: none;
  cursor: default;
}
</style>
