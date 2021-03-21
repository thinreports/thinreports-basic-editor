<template>
  <g>
    <rect
      width="100%"
      height="100%"
      class="th-layer-item-dragger"
      @pointermove="drag"
      @pointerup="finish"
    />
    <g
      v-if="isStarted"
      :transform="reportTransform"
    >
      <ItemOutline
        :item-type="itemType"
        :bounding-points="outlineBounds"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { BoundsTransformer } from '../lib/bounds-transformer';
import { operator, report } from '../store';
import ItemOutline from './items/ItemOutline.vue';
import { Coords, BoundingPoints, ItemType } from '@/types';

type Data = {
  itemType: ItemType | null;
  itemBounds: BoundingPoints | null;
  initialPointer: Coords | null;
  outlineBounds: BoundingPoints | null;
};

class UnexpectedStateError extends Error {
  constructor () {
    super();
    this.name = 'UnexpectedStateError';
  }
};

export default Vue.extend({
  name: 'LayerItemDragger',
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
      itemType: null,
      itemBounds: null,
      initialPointer: null,
      outlineBounds: null
    };
  },
  computed: {
    isStarted (): boolean {
      return this.initialPointer !== null;
    },
    draggerState: () => operator.state.itemDragger
  },
  methods: {
    start (e: MouseEvent) {
      const point = this.transformSvgPoint(e);

      if (!this.draggerState.itemUid) throw new UnexpectedStateError();

      const item = report.getters.findItem(this.draggerState.itemUid);

      this.itemType = item.type;
      this.itemBounds = this.convertToReportCoords(report.getters.itemBounds(item.uid));
      this.outlineBounds = { ...this.itemBounds };
      this.initialPointer = { x: point.x, y: point.y };
    },
    drag (e: MouseEvent) {
      if (!this.isStarted) this.start(e);

      const point = this.transformSvgPoint(e);

      if (!this.itemBounds || !this.outlineBounds || !this.initialPointer) throw new UnexpectedStateError();

      const deltaPointer = {
        x: point.x - this.initialPointer.x,
        y: point.y - this.initialPointer.y
      };

      this.outlineBounds = {
        x1: this.itemBounds.x1 + deltaPointer.x,
        y1: this.itemBounds.y1 + deltaPointer.y,
        x2: this.itemBounds.x2 + deltaPointer.x,
        y2: this.itemBounds.y2 + deltaPointer.y
      };
    },
    finish () {
      if (!this.isStarted) {
        this.cancel();
        return;
      }
      if (!this.outlineBounds) throw new UnexpectedStateError();

      this.moveItemTo(this.convertToLocalCoords(this.outlineBounds));

      operator.actions.finishItemDrag();
    },
    cancel () {
      operator.actions.finishItemDrag();
    },
    moveItemTo (bounds: BoundingPoints) {
      if (!this.draggerState.itemUid || !this.itemType) throw new UnexpectedStateError();

      const payload = { uid: this.draggerState.itemUid, bounds };

      switch (this.itemType) {
        case 'rect': report.actions.moveRectItemTo(payload); break;
        case 'ellipse': report.actions.moveEllipseItemTo(payload); break;
        case 'line': report.actions.moveLineItemTo(payload); break;
        case 'image-block': report.actions.moveImageBlockItemTo(payload); break;
        case 'image': report.actions.moveImageItemTo(payload); break;
        case 'text': report.actions.moveTextItemTo(payload); break;
        case 'text-block': report.actions.moveTextBlockItemTo(payload); break;
        case 'stack-view': report.actions.moveStackViewItemTo(payload); break;
        default:
          throw new Error('Not Implemented');
      }
    },
    convertToReportCoords (boundingPoints: BoundingPoints): BoundingPoints {
      const localTranslation = this.draggerState.translation;
      if (!localTranslation) throw new UnexpectedStateError();

      return new BoundsTransformer(boundingPoints).expand(localTranslation).toBPoints();
    },
    convertToLocalCoords (boundingPoints: BoundingPoints): BoundingPoints {
      const localTranslation = this.draggerState.translation;
      if (!localTranslation) throw new UnexpectedStateError();

      return new BoundsTransformer(boundingPoints).relativeFrom(localTranslation).toBPoints();
    }
  }
});
</script>

<style scoped>
.th-layer-item-dragger {
  stroke: none;
  fill: none;
  pointer-events: visible;
  cursor: move;
}
</style>
