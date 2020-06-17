<template>
  <div>
    <RectItemProperties
      v-if="isRectItem"
      :item="item"
    />
    <EllipseItemProperties
      v-if="isEllipseItem"
      :item="item"
    />
    <LineItemProperties
      v-if="isLineItem"
      :item="item"
    />
    <TextItemProperties
      v-if="isTextItem"
      :item="item"
    />
    <TextBlockItemProperties
      v-if="isTextBlockItem"
      :item="item"
    />
    <ImageItemProperties
      v-if="isImageItem"
      :item="item"
    />
    <ImageBlockItemProperties
      v-if="isImageBlockItem"
      :item="item"
    />
    <StackViewItemProperties
      v-if="isStackViewItem"
      :item="item"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import EllipseItemProperties from './EllipseItemProperties.vue';
import ImageBlockItemProperties from './ImageBlockItemProperties.vue';
import ImageItemProperties from './ImageItemProperties.vue';
import LineItemProperties from './LineItemProperties.vue';
import RectItemProperties from './RectItemProperties.vue';
import StackViewItemProperties from './StackViewItemProperties.vue';
import TextBlockItemProperties from './TextBlockItemProperties.vue';
import TextItemProperties from './TextItemProperties.vue';
import { AnyItem } from '@/types';

export default Vue.extend({
  name: 'ItemProperties',
  components: {
    RectItemProperties,
    EllipseItemProperties,
    LineItemProperties,
    TextItemProperties,
    TextBlockItemProperties,
    ImageItemProperties,
    ImageBlockItemProperties,
    StackViewItemProperties
  },
  props: {
    item: {
      type: Object as PropType<AnyItem>,
      required: true
    }
  },
  computed: {
    isRectItem (): boolean {
      return this.item.type === 'rect';
    },
    isEllipseItem (): boolean {
      return this.item.type === 'ellipse';
    },
    isLineItem (): boolean {
      return this.item.type === 'line';
    },
    isTextItem (): boolean {
      return this.item.type === 'text';
    },
    isTextBlockItem (): boolean {
      return this.item.type === 'text-block';
    },
    isImageItem (): boolean {
      return this.item.type === 'image';
    },
    isImageBlockItem (): boolean {
      return this.item.type === 'image-block';
    },
    isStackViewItem (): boolean {
      return this.item.type === 'stack-view';
    }
  }
});
</script>

<style scoped></style>
