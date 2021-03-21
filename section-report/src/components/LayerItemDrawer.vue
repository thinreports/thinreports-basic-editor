<template>
  <g>
    <rect
      width="100%"
      height="100%"
      class="th-layer-item-drawer"
      @pointermove="draw"
      @pointerup="finish"
    />
    <g
      v-if="isStarted"
      :transform="reportTransform"
    >
      <ItemOutline
        :item-type="drawerState.itemType"
        :bounding-points="outlineBounds"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BoundsTransformer } from '../lib/bounds-transformer';
import { operator, report, editor } from '../store';
import ItemOutline from './items/ItemOutline.vue';
import { BoundingPoints, Coords } from '@/types';

type Data = {
  outlineBounds: BoundingPoints | null;
};

class UnexpectedStateError extends Error {
  constructor () {
    super();
    this.name = 'UnexpectedStateError';
  }
};

export default Vue.extend({
  name: 'LayerItemDrawer',
  components: {
    ItemOutline
  },
  props: {
    reportTransform: {
      type: String,
      required: true
    },
    transformSvgPoint: {
      type: Function as PropType<(point: Coords) => Coords>,
      required: true
    }
  },
  data (): Data {
    return {
      outlineBounds: null
    };
  },
  computed: {
    isStarted (): boolean {
      return this.outlineBounds !== null;
    },
    drawerState: () => operator.state.itemDrawer
  },
  methods: {
    start (e: MouseEvent) {
      const point = this.transformSvgPoint(e);

      this.outlineBounds = {
        x1: point.x,
        y1: point.y,
        x2: point.x,
        y2: point.y
      };
    },
    draw (e: MouseEvent) {
      const point = this.transformSvgPoint(e);

      if (!this.isStarted) this.start(e);
      if (!this.outlineBounds) throw new UnexpectedStateError();

      this.outlineBounds.x2 = point.x;
      this.outlineBounds.y2 = point.y;
    },
    finish () {
      if (!this.isStarted || this.isOutlineEmpty()) {
        this.cancel();
        return;
      }

      if (!this.outlineBounds) throw new UnexpectedStateError();

      this.drawNewItem(this.convertToLocalCoords(this.outlineBounds));

      operator.actions.finishItemDraw();
      editor.actions.activateTool({ tool: 'select' });
    },
    cancel () {
      operator.actions.finishItemDraw();
    },
    isOutlineEmpty () {
      if (this.outlineBounds) {
        const box = new BoundsTransformer(this.outlineBounds).toBBox();
        return box.width < 4 && box.height < 4;
      } else {
        return true;
      }
    },
    drawNewItem (bounds: BoundingPoints) {
      const { itemType, targetType, targetUid } = this.drawerState;

      if (!itemType || !targetType || !targetUid) throw new UnexpectedStateError();

      const payload = { targetType, targetUid, bounds };

      switch (itemType) {
        case 'rect': report.actions.drawNewRectItem(payload); break;
        case 'ellipse': report.actions.drawNewEllipseItem(payload); break;
        case 'line': report.actions.drawNewLineItem(payload); break;
        case 'text': report.actions.drawNewTextItem(payload); break;
        case 'text-block': report.actions.drawNewTextBlockItem(payload); break;
        case 'image-block': report.actions.drawNewImageBlockItem(payload); break;
        case 'stack-view': report.actions.drawNewStackViewItem(payload); break;
        default:
          throw new Error(`Invalid itemType: ${itemType}`);
      }
    },
    convertToLocalCoords (bPoints: BoundingPoints): BoundingPoints {
      const localTranslation = this.drawerState.translation;
      if (!localTranslation) throw new UnexpectedStateError();

      return new BoundsTransformer(bPoints).relativeFrom(localTranslation).toBPoints();
    }
  }
});
</script>

<style scoped>
.th-layer-item-drawer {
  stroke: none;
  fill: none;
  pointer-events: visible;
  cursor: crosshair;
}
</style>
