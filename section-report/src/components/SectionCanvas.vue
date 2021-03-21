<template>
  <g :transform="transform">
    <CanvasDrawer
      v-if="isDrawMode"
      :width="width"
      :height="section.height"
      @startDraw="startDrawItem"
    />
    <SectionCanvasHighlighter
      v-if="isActive"
      :height="section.height"
    />
    <g
      v-for="item in items"
      :key="item.uid"
    >
      <StackViewItem
        v-if="item.type === 'stack-view'"
        :item="item"
        :section-translation="translation"
        @itemDragStart="startDragItem"
      />
      <component
        :is="`${item.type}-item`"
        v-else
        :item="item"
        @itemDragStart="startDragItem"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { report, operator, editor } from '../store';
import SectionCanvasHighlighter from './SectionCanvasHighlighter.vue';
import CanvasDrawer from './base/CanvasDrawer.vue';
import EllipseItem from './items/EllipseItem.vue';
import ImageBlockItem from './items/ImageBlockItem.vue';
import ImageItem from './items/ImageItem.vue';
import LineItem from './items/LineItem.vue';
import RectItem from './items/RectItem.vue';
import StackViewItem from './items/StackViewItem.vue';
import TextBlockItem from './items/TextBlockItem.vue';
import TextItem from './items/TextItem.vue';
import { AnySection, AnyItem, ItemType, Coords } from '@/types';

export default Vue.extend({
  name: 'SectionCanvas',
  components: {
    RectItem,
    EllipseItem,
    LineItem,
    TextItem,
    TextBlockItem,
    ImageBlockItem,
    ImageItem,
    StackViewItem,
    SectionCanvasHighlighter,
    CanvasDrawer
  },
  props: {
    section: {
      type: Object as PropType<AnySection>,
      required: true
    },
    top: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      pointerDown: false
    };
  },
  computed: {
    paperSize: () => report.getters.paperSize(),
    isDrawMode: () => editor.getters.isDrawMode(),
    width (): number {
      return this.paperSize.width;
    },
    transform (): string {
      return `translate(${Object.values(this.translation).join(',')})`;
    },
    translation (): Coords {
      return { x: 0, y: this.top };
    },
    isActive (): boolean {
      return report.getters.isActiveSection(this.section.uid);
    },
    items (): AnyItem[] {
      const getters = report.getters;
      return this.section.items.map(uid => getters.findItem(uid));
    }
  },
  methods: {
    startDragItem (item: AnyItem) {
      operator.actions.startItemDrag({
        itemUid: item.uid,
        translation: this.translation
      });
    },
    startDrawItem () {
      const itemType = editor.state.activeTool as ItemType;

      operator.actions.startItemDraw({
        itemType,
        targetType: 'section',
        targetUid: this.section.uid,
        translation: this.translation
      });
    }
  }
});
</script>

<style scoped>
.th-section-body {
  fill: #ffffff;
  stroke: none;
  fill-opacity: 0;
}
</style>
