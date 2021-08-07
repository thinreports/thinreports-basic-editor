<template>
  <ItemEntity
    :item="item"
    @itemDrag="dragStart"
    @itemClick="activate"
  >
    <BoxItemHighlighter
      v-if="isActive"
      :item-bounds="item"
      :item-border-radius="item.borderRadius"
      :item-stroke-width="item.style.borderWidth"
    />
    <RectItemBody :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import BoxItemHighlighter from './BoxItemHighlighter.vue';
import ItemEntity from './ItemEntity.vue';
import RectItemBody from './RectItemBody.vue';
import { RectItem } from '@/types';

export default Vue.extend({
  name: 'RectItem',
  components: {
    ItemEntity,
    BoxItemHighlighter,
    RectItemBody
  },
  props: {
    item: {
      type: Object as PropType<RectItem>,
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
