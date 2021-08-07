<template>
  <ItemEntity
    :item="item"
    @itemDrag="dragStart"
    @itemClick="activate"
  >
    <EllipseItemHighlighter
      v-if="isActive"
      :item="item"
    />
    <EllipseItemBody :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import EllipseItemBody from './EllipseItemBody.vue';
import EllipseItemHighlighter from './EllipseItemHighlighter.vue';
import ItemEntity from './ItemEntity.vue';
import { EllipseItem } from '@/types';

export default Vue.extend({
  name: 'EllipseItem',
  components: {
    ItemEntity,
    EllipseItemBody,
    EllipseItemHighlighter
  },
  props: {
    item: {
      type: Object as PropType<EllipseItem>,
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
