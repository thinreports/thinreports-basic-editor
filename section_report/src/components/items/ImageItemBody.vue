<template>
  <!-- eslint-disable vue/attribute-hyphenation -->
  <image
    :xlink:href="href"
    :x="item.x"
    :y="item.y"
    :width="item.width"
    :height="item.height"
    preserveAspectRatio="none"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ImageItem } from '@/types';

export default Vue.extend({
  name: 'ImageItemBody',
  props: {
    item: {
      type: Object as PropType<ImageItem>,
      required: true
    }
  },
  computed: {
    href (): string {
      const data = this.item.data;
      return `data:${data.mimeType};base64,${data.base64}`;
    }
  }
});
</script>
