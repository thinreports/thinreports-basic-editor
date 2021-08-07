<template>
  <g>
    <rect
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
      class="th-image-block-body"
    />
    <foreignObject
      :x="item.x"
      :y="item.y"
      :width="item.width"
      :height="item.height"
    >
      <div class="th-image-icon-wrapper">
        <div
          class="th-image-icon"
          :style="iconStyle"
        >
          <i class="mdi mdi-image-area" />
        </div>
      </div>
    </foreignObject>
    <ItemIdLabel
      :label="id"
      :x="item.x"
      :y="item.y"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '../../lib/inverse-scale';
import { editor } from '../../store';
import ItemIdLabel from './ItemIdLabel.vue';
import { ImageBlockItem } from '@/types';

export default Vue.extend({
  name: 'ImageBlockItemBody',
  components: {
    ItemIdLabel
  },
  props: {
    item: {
      type: Object as PropType<ImageBlockItem>,
      required: true
    }
  },
  computed: {
    id (): string {
      return this.item.id === '' ? 'no id' : this.item.id;
    },
    iconStyle () {
      return {
        fontSize: `${inverseScale(1.7, editor.getters.zoomRate())}rem`
      };
    }
  }
});
</script>

<style scoped>
.th-image-block-body {
  stroke: none;
  fill: var(--th-active-color);
  fill-opacity: 0.2;
}

.th-image-icon-wrapper {
  pointer-events: none;
  display: table;
  width: 100%;
  height: 100%;
}

.th-image-icon {
  display: table-cell;
  user-select: none;
  pointer-events: none;
  vertical-align: middle;
  text-align: center;
  color: #ffffff;
  opacity: 0.8;
}
</style>
