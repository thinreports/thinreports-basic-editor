<template>
  <g>
    <g v-if="isActive">
      <StackViewItemModifier
        :item-bounds="bounds"
        @modifierDrag="dragStart"
        @modifierClick="activate"
      />
      <StackViewItemRows
        :rows="item.rows"
        :item-bounds="bounds"
        :section-translation="sectionTranslation"
        :stack-view-active="true"
      />
    </g>
    <g v-else>
      <ItemEntity
        :item="item"
        @itemClick="activate"
      >
        <StackViewItemRows
          :rows="item.rows"
          :item-bounds="bounds"
          :section-translation="sectionTranslation"
          :stack-view-active="false"
        />
        <StackViewItemBody :item-bounds="bounds" />
      </ItemEntity>
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import ItemEntity from './ItemEntity.vue';
import StackViewItemBody from './StackViewItemBody.vue';
import StackViewItemModifier from './StackViewItemModifier.vue';
import StackViewItemRows from './StackViewItemRows.vue';
import { StackViewItem, BoundingBox, Translation } from '@/types';

export default Vue.extend({
  name: 'StackViewItem',
  components: {
    ItemEntity,
    StackViewItemBody,
    StackViewItemModifier,
    StackViewItemRows
  },
  props: {
    item: {
      type: Object as PropType<StackViewItem>,
      required: true
    },
    sectionTranslation: {
      type: Object as PropType<Translation>,
      required: true
    }
  },
  computed: {
    isActive (): boolean {
      return report.getters.isActiveStackViewTree(this.item.uid);
    },
    bounds (): BoundingBox {
      return {
        x: this.item.x,
        y: this.item.y,
        width: this.item.width,
        height: report.getters.heightOfStackView(this.item.uid)
      };
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
