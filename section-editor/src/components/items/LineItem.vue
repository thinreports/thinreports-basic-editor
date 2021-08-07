<template>
  <ItemEntity
    :item="item"
    @itemDrag="dragStart"
    @itemClick="activate"
  >
    <LineItemHighligher
      v-if="isActive"
      :item="item"
    />
    <LineItemBody :item="item" />
    <LineItemSelector :item="item" />
  </ItemEntity>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import ItemEntity from './ItemEntity.vue';
import LineItemBody from './LineItemBody.vue';
import LineItemHighligher from './LineItemHighligher.vue';
import LineItemSelector from './LineItemSelector.vue';
import { LineItem } from '@/types';

export default Vue.extend({
  name: 'LineItem',
  components: {
    ItemEntity,
    LineItemBody,
    LineItemHighligher,
    LineItemSelector
  },
  props: {
    item: {
      type: Object as PropType<LineItem>,
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
