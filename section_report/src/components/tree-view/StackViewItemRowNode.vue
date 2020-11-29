<template>
  <ul>
    <li>
      <NodeButton
        :id="rowId"
        name="row"
        :active="active"
        @click="emitActivate"
      >
        <i class="mdi mdi-view-agenda-outline" />
      </NodeButton>
      <ul v-if="itemUids.length">
        <GraphicItemNode
          v-for="item in items"
          :key="item.uid"
          :item-id="item.id"
          :item-type="item.type"
          :active="activeItemUid === item.uid"
          @activate="activateItem(item.uid)"
        />
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import { ItemUid, StackViewRow, GraphicItem } from '../../types';
import GraphicItemNode from './GraphicItemNode.vue';
import NodeButton from './NodeButton.vue';

export default Vue.extend({
  name: 'StackViewItemRowNode',
  components: {
    GraphicItemNode,
    NodeButton
  },
  props: {
    rowId: {
      type: String as PropType<StackViewRow['id']>,
      required: true
    },
    itemUids: {
      type: Array as PropType<ItemUid[]>,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    items (): GraphicItem[] {
      return this.itemUids.map(uid => report.getters.findGraphicItem(uid));
    },
    activeItemUid: () => report.getters.activeItem()?.uid
  },
  methods: {
    emitActivate () {
      this.$emit('activate');
    },
    activateItem (uid: ItemUid) {
      report.actions.activateEntity({ type: 'item', uid });
    }
  }
});
</script>
