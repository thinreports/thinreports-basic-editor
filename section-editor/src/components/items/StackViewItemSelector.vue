<template>
  <rect
    :x="item.x"
    :y="item.y"
    :width="item.width"
    :height="height"
    class="th-stack-view-selector"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { StackViewItem } from '@/types';

export default Vue.extend({
  name: 'StackViewItemSelector',
  props: {
    item: {
      type: Object as PropType<StackViewItem>,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  }
});
</script>

<style scoped>
.th-stack-view-selector {
  stroke: none;
  fill: #ffffff;
  fill-opacity: 0;
  cursor: default;
}
</style>
