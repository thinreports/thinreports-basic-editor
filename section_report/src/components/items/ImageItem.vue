<template>
  <ItemEntity
    :item="item"
    @itemDrag="dragStart"
    @itemClick="activate"
  >
    <BoxItemHighlighter
      v-if="isActive"
      :item-bounds="item"
    />
    <ImageItemBody :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import BoxItemHighlighter from './BoxItemHighlighter.vue';
import ImageItemBody from './ImageItemBody.vue';
import ItemEntity from './ItemEntity.vue';
import { ImageItem } from '@/types';

export default Vue.extend({
  name: 'ImageItem',
  components: {
    ItemEntity,
    ImageItemBody,
    BoxItemHighlighter
  },
  props: {
    item: {
      type: Object as PropType<ImageItem>,
      required: true
    }
  },
  computed: {
    isActive (): boolean {
      return report.getters.isActiveItem(this.item.uid);
    }
  },
  methods: {
    dragStart () {
      this.$emit('itemDragStart', this.item);
    },
    activate () {
      report.actions.activateEntity({ uid: this.item.uid, type: 'item' });
    }
  }
});
</script>
