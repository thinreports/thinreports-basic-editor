<template>
  <g>
    <rect
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
      class="th-text-block-body"
    />
    <ItemIdLabel
      :label="item.id"
      :x="item.x"
      :y="item.y"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import ItemIdLabel from './ItemIdLabel.vue';
import { TextBlockItem } from '@/types';

export default Vue.extend({
  name: 'TextBlockItemBody',
  components: {
    ItemIdLabel
  },
  props: {
    item: {
      type: Object as PropType<TextBlockItem>,
      required: true
    }
  }
});
</script>

<style scoped>
.th-text-block-body {
  stroke: none;
  fill: var(--th-active-color);
  fill-opacity: 0.2;
}
</style>
