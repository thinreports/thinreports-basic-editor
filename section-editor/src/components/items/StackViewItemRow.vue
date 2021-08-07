<template>
  <g :transform="transform">
    <CanvasDrawer
      v-if="isDrawMode"
      :width="bounds.width"
      :height="bounds.height"
      @startDraw="startDrawItem"
    />
    <StackViewItemRowHighlighter
      v-if="isActive"
      :height="bounds.height"
    />
    <g
      v-for="item in items"
      :key="item.uid"
    >
      <component
        :is="`${item.type}-item`"
        :item="item"
        @itemDragStart="startDragItem"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { calcPlus } from '../../lib/strict-calculator';
import { report, operator, editor } from '../../store';
import CanvasDrawer from '../base/CanvasDrawer.vue';
import EllipseItem from './EllipseItem.vue';
import ImageBlockItem from './ImageBlockItem.vue';
import ImageItem from './ImageItem.vue';
import LineItem from './LineItem.vue';
import RectItem from './RectItem.vue';
import StackViewItemRowHighlighter from './StackViewItemRowHighlighter.vue';
import TextBlockItem from './TextBlockItem.vue';
import TextItem from './TextItem.vue';
import { StackViewRow, AnyItem, ItemType, Translation, BoundingBox } from '@/types';

export default Vue.extend({
  name: 'StackViewItemRow',
  components: {
    RectItem,
    EllipseItem,
    LineItem,
    TextItem,
    TextBlockItem,
    ImageBlockItem,
    ImageItem,
    StackViewItemRowHighlighter,
    CanvasDrawer
  },
  props: {
    row: {
      type: Object as PropType<StackViewRow>,
      required: true
    },
    bounds: {
      type: Object as PropType<BoundingBox>,
      required: true
    },
    sectionTranslation: {
      type: Object as PropType<Translation>,
      required: true
    }
  },
  data () {
    return {
      pointerDown: false
    };
  },
  computed: {
    isDrawMode: () => editor.getters.isDrawMode(),
    transform (): string {
      return `translate(${Object.values(this.translation).join(',')})`;
    },
    translation (): Translation {
      return { x: this.bounds.x, y: this.bounds.y };
    },
    translationByReport (): Translation {
      return {
        x: calcPlus(this.translation.x, this.sectionTranslation.x),
        y: calcPlus(this.translation.y, this.sectionTranslation.y)
      };
    },
    isActive (): boolean {
      return report.getters.isActiveStackViewRow(this.row.uid);
    },
    items (): AnyItem[] {
      return this.row.items.map(uid => report.getters.findItem(uid));
    }
  },
  methods: {
    startDragItem (item: AnyItem) {
      operator.actions.startItemDrag({
        itemUid: item.uid,
        translation: this.translationByReport
      });
    },
    startDrawItem () {
      const itemType = editor.state.activeTool as ItemType;

      if (itemType === 'stack-view') return;

      operator.actions.startItemDraw({
        itemType,
        targetType: 'stack-view-row',
        targetUid: this.row.uid,
        translation: this.translationByReport
      });
    }
  }
});
</script>

<style scoped></style>
