<template>
  <g>
    <rect
      x="0"
      y="0"
      :width="contentSize.width"
      :height="contentSize.height"
      class="th-report-canvas"
    />
    <CanvasSelector
      v-for="{ schema, top } in sectionWithPositions"
      :key="`selector-${schema.uid}`"
      :bounds="selectorBounds({ schema, top })"
      @select="activateSection(schema.uid)"
    />
    <g
      v-for="({ schema, top }, index) in sectionWithPositions"
      :key="schema.uid"
    >
      <SectionCanvas
        :section="schema"
        :top="top"
      />
      <SectionDivider
        v-if="!isLastSection(index)"
        :top="top + schema.height"
        :width="contentSize.width"
      />
    </g>
  </g>
</template>

<script lang="ts">
import Vue from 'vue';
import { calcPlus } from '../lib/strict-calculator';
import { report } from '../store';
import SectionCanvas from './SectionCanvas.vue';
import SectionDivider from './SectionDivider.vue';
import CanvasSelector from './base/CanvasSelector.vue';
import { Section, Size, SectionUid, BoundingBox } from '@/types';

type SectionWithPosition = {
  schema: Section;
  top: number;
};

export default Vue.extend({
  name: 'ReportCanvas',
  components: {
    SectionCanvas,
    SectionDivider,
    CanvasSelector
  },
  computed: {
    sectionWithPositions (): SectionWithPosition[] {
      const sections: {
        schema: Section;
        top: number;
      }[] = [];

      let top = 0;
      this.sections.forEach(section => {
        sections.push({ schema: section, top });
        top = calcPlus(top, section.height);
      });

      return sections;
    },
    sections: () => report.getters.sections(),
    contentSize: (): Size => report.getters.contentSize()
  },
  methods: {
    activateSection (uid: SectionUid) {
      report.actions.activateEntity({ uid, type: 'section' });
    },
    selectorBounds ({ schema, top }: SectionWithPosition): BoundingBox {
      return {
        x: 0,
        y: top,
        width: this.contentSize.width,
        height: schema.height
      };
    },
    isLastSection (index: number): boolean {
      return this.sections.length === index + 1;
    }
  }
});
</script>

<style scoped>
.th-report-canvas {
  fill: #ffffff;
  stroke: none;
}
</style>
