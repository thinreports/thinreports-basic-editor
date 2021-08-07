<template>
  <li>
    <NodeButton
      :id="itemId"
      :name="itemType"
      :active="active"
      @click="emitActivate"
    >
      <ItemIcon :type="itemType" />
    </NodeButton>
  </li>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Item } from '../../types';
import ItemIcon from '../icons/ItemIcon.vue';
import NodeButton from './NodeButton.vue';

export default Vue.extend({
  name: 'GraphicItemNode',
  components: {
    ItemIcon,
    NodeButton
  },
  props: {
    itemId: {
      type: String as PropType<Item['id']>,
      required: true
    },
    itemType: {
      type: String as PropType<Item['type']>,
      required: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitActivate () {
      this.$emit('activate');
    }
  }
});
</script>

<style scoped></style>
