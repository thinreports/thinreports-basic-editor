<template>
  <div
    ref="container"
    class="th-report-pane"
  >
    <svg
      ref="canvasSvg"
      :viewBox="viewBox"
      :width="width || '100%'"
      :height="height || '100%'"
      :style="{ minWidth }"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <g
        ref="canvas"
        :transform="reportTransform"
      >
        <ReportCanvas />
      </g>
      <g style="pointer-events: none;">
        <LayerItemDrawer
          v-if="isItemDrawerActive"
          :report-transform="reportTransform"
          :transform-svg-point="transformSvgPoint"
        />
        <LayerItemDragger
          v-if="isItemDraggerActive"
          :report-transform="reportTransform"
          :transform-svg-point="transformSvgPoint"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { calcDiv, calcMinus, calcMul } from '../lib/strict-calculator';
import { Translation, Size, Coords } from '../types';
import LayerItemDragger from './LayerItemDragger.vue';
import LayerItemDrawer from './LayerItemDrawer.vue';
import ReportCanvas from './ReportCanvas.vue';
import { report, editor, operator } from '@/store';

const REPORT_MARGIN_PX = 60;

type Data = {
  containerSize: Size | null;
};

export default Vue.extend({
  name: 'ReportPane',
  components: {
    ReportCanvas,
    LayerItemDrawer,
    LayerItemDragger
  },
  data (): Data {
    return {
      containerSize: null
    };
  },
  computed: {
    reportTranslation (): Translation {
      if (this.width !== null && this.height !== null) {
        const x = calcMinus(calcDiv(this.width, 2), calcDiv(this.contentSize.width, 2));
        return {
          x: x < REPORT_MARGIN_PX ? REPORT_MARGIN_PX : x,
          y: REPORT_MARGIN_PX
        };
      } else {
        return { x: 0, y: 0 };
      }
    },
    reportTransform (): string {
      const translation = this.reportTranslation;
      return `translate(${translation.x},${translation.y}) scale(${editor.getters.zoomRate()})`;
    },
    viewBox (): string | null {
      if (this.width !== null && this.height !== null) {
        return [0, 0, this.width, this.height].join(' ');
      } else {
        return null;
      }
    },
    minWidth (): string {
      return this.width !== null ? `${this.width}px` : '100%';
    },
    width (): number | null {
      if (!this.containerSize) return null;
      return this.containerSize.width < this.contentSize.width + REPORT_MARGIN_PX * 2 ? this.contentSize.width + REPORT_MARGIN_PX * 2 : this.containerSize.width;
    },
    height (): number | null {
      if (!this.containerSize) return null;
      return (this.containerSize.height < this.contentSize.height + REPORT_MARGIN_PX * 2 ? this.contentSize.height + REPORT_MARGIN_PX * 2 : this.containerSize.height);
    },
    isItemDraggerActive: () => operator.state.itemDragger.active,
    isItemDrawerActive: () => operator.state.itemDrawer.active,
    contentSize (): Size {
      const { width, height } = report.getters.contentSize();
      const zoomRate = editor.getters.zoomRate();
      return {
        width: calcMul(width, zoomRate),
        height: calcMul(height, zoomRate)
      };
    }
  },
  created () {
    report.actions.addInitialSections();
  },
  mounted () {
    window.addEventListener('resize', this.recalculateContainerSize);
    this.$nextTick(() => this.recalculateContainerSize());
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.recalculateContainerSize);
  },
  methods: {
    recalculateContainerSize () {
      const containerClientRect = (this.$refs.container as HTMLElement).getBoundingClientRect();
      this.containerSize = {
        width: containerClientRect.width,
        height: containerClientRect.height
      };
    },
    transformSvgPoint (point: Coords): Coords {
      const canvasSvg = this.$refs.canvasSvg as SVGSVGElement;
      const canvas = this.$refs.canvas as SVGGElement;
      const canvasCTM = canvas.getScreenCTM();

      if (!canvasCTM) throw new Error('Failed to transform point');

      const svgPoint = canvasSvg.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;

      const transformedPoint = svgPoint.matrixTransform(canvasCTM.inverse());

      return {
        x: transformedPoint.x,
        y: transformedPoint.y
      };
    }
  }
});
</script>

<style scoped>
.th-report-pane {
  overflow: auto;
  background-color: #e0e0e0;
}
</style>
