<template>
  <li>
    <NodeButton
      :id="itemId"
      name="stack-view"
      :active="active"
      @click="emitActivate"
    >
      <ItemIcon type="stack-view" />
    </NodeButton>
    <StackViewItemRowNode
      v-for="row in rows"
      :key="row.uid"
      :row-id="row.id"
      :item-uids="row.items"
      :active="activeRowUid === row.uid"
      @activate="activateRow(row.uid)"
    />
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import { StackViewItem, StackViewRow, StackViewRowUid } from '../../types';
import ItemIcon from '../icons/ItemIcon.vue';
import NodeButton from './NodeButton.vue';
import StackViewItemRowNode from './StackViewItemRowNode.vue';

export default Vue.extend({
  name: 'StackViewItemNode',
  components: {
    StackViewItemRowNode,
    NodeButton,
    ItemIcon
  },
  props: {
    itemId: {
      type: String as PropType<StackViewItem['id']>,
      required: true
    },
    rowUids: {
      type: Array as PropType<StackViewRowUid[]>,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    rows (): StackViewRow[] {
      return this.rowUids.map(uid => report.getters.findStackViewRow(uid));
    },
    activeRowUid: () => report.getters.activeStackViewRow()?.uid
  },
  methods: {
    emitActivate () {
      this.$emit('activate');
    },
    activateRow (uid: StackViewRowUid) {
      report.actions.activateEntity({ type: 'stack-view-row', uid });
    }
  }
});
</script>

<style scoped></style>
