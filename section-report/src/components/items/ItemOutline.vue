<template>
  <g>
    <EllipseItemOutline
      v-if="itemType === 'ellipse'"
      :bounding-box="boundingBox"
    />
    <LineItemOutline
      v-else-if="itemType === 'line'"
      :bounding-points="boundingPoints"
    />
    <BoxItemOutline
      v-else
      :bounds="boundingBox"
    />
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BoundsTransformer } from '../../lib/bounds-transformer';
import BoxItemOutline from './BoxItemOutline.vue';
import EllipseItemOutline from './EllipseItemOutline.vue';
import LineItemOutline from './LineItemOutline.vue';
import { BoundingPoints, ItemType, BoundingBox } from '@/types';

export default Vue.extend({
  name: 'ItemOutline',
  components: {
    EllipseItemOutline,
    BoxItemOutline,
    LineItemOutline
  },
  props: {
    itemType: {
      type: String as PropType<ItemType>,
      required: true
    },
    boundingPoints: {
      type: Object as PropType<BoundingPoints>,
      required: true
    }
  },
  computed: {
    boundingBox (): BoundingBox {
      return new BoundsTransformer(this.boundingPoints).toBBox();
    }
  }
});
</script>
