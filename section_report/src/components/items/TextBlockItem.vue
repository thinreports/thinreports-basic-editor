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
    <TextBlockItemBody :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import BoxItemHighlighter from './BoxItemHighlighter.vue';
import ItemEntity from './ItemEntity.vue';
import TextBlockItemBody from './TextBlockItemBody.vue';
import { TextBlockItem } from '@/types';

export default Vue.extend({
  name: 'TextBlockItem',
  components: {
    ItemEntity,
    TextBlockItemBody,
    BoxItemHighlighter
  },
  props: {
    item: {
      type: Object as PropType<TextBlockItem>,
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
