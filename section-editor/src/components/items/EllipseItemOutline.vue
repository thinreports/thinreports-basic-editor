<template>
  <ellipse
    :cx="cx"
    :cy="cy"
    :rx="rx"
    :ry="ry"
    :stroke-width="strokeWidth"
    class="th-ellipse-item-outline"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { inverseScale } from '@/lib/inverse-scale';
import { editor } from '@/store';
import { BoundingBox, EllipseItem } from '@/types';

export default Vue.extend({
  name: 'EllipseItemOutline',
  props: {
    boundingBox: {
      type: Object as PropType<BoundingBox>,
      required: true
    }
  },
  computed: {
    cx (): EllipseItem['cx'] {
      return this.boundingBox.x + this.rx;
    },
    cy (): EllipseItem['cy'] {
      return this.boundingBox.y + this.ry;
    },
    rx (): EllipseItem['rx'] {
      return this.boundingBox.width / 2;
    },
    ry (): EllipseItem['ry'] {
      return this.boundingBox.height / 2;
    },
    strokeWidth (): number {
      return inverseScale(1, editor.getters.zoomRate());
    }
  }
});
</script>

<style scoped>
.th-ellipse-item-outline {
  stroke: #999;
  fill: none;
}
</style>
