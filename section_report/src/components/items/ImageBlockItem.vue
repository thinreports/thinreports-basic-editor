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
    <ImageBlockItemBody :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import BoxItemHighlighter from './BoxItemHighlighter.vue';
import ImageBlockItemBody from './ImageBlockItemBody.vue';
import ItemEntity from './ItemEntity.vue';
import { ImageBlockItem } from '@/types';

export default Vue.extend({
  name: 'ImageBlockItem',
  components: {
    ItemEntity,
    ImageBlockItemBody,
    BoxItemHighlighter
  },
  props: {
    item: {
      type: Object as PropType<ImageBlockItem>,
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
