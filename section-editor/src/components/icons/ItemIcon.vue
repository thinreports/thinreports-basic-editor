<template>
  <i :class="iconClass" />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ItemType } from '../../types';

export default Vue.extend({
  name: 'ItemIcon',
  props: {
    type: {
      type: String as PropType<ItemType>,
      required: true
    }
  },
  computed: {
    iconClass () {
      switch (this.type) {
        case 'rect': return 'mdi mdi-rectangle-outline';
        case 'ellipse': return 'mdi mdi-ellipse-outline';
        case 'line': return 'mdi mdi-vector-line';
        case 'image': return 'mdi mdi-image';
        case 'text': return 'mdi mdi-format-text';
        case 'text-block': return 'mdi mdi-text-recognition';
        case 'image-block': return 'mdi mdi-image-size-select-large';
        case 'stack-view': return 'mdi mdi-table-column';
        default: throw new Error('Invalid item type');
      }
    }
  }
});
</script>
