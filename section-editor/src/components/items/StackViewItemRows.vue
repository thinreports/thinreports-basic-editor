<template>
  <g>
    <CanvasSelector
      v-for="{ row, bounds } in rowWithBounds"
      :key="`selector-${row.uid}`"
      :bounds="bounds"
      @select="activateRow(row.uid)"
    />
    <g
      v-for="({ row, bounds }, index) in rowWithBounds"
      :key="row.uid"
    >
      <StackViewItemRow
        :row="row"
        :bounds="bounds"
        :section-translation="sectionTranslation"
      />
      <StackViewItemRowDivider
        v-if="stackViewActive && !isLastRow(index)"
        :top="bounds.y + bounds.height"
        :left="bounds.x"
        :width="bounds.width"
      />
    </g>
  </g>
</template>

<script lang="ts">
import { DeepReadonly } from 'utility-types';
import Vue, { PropType } from 'vue';
import { report } from '../../store';
import CanvasSelector from '../base/CanvasSelector.vue';
import StackViewItemRow from './StackViewItemRow.vue';
import StackViewItemRowDivider from './StackViewItemRowDivider.vue';
import { StackViewRow, Translation, BoundingBox, StackViewItem, StackViewRowUid } from '@/types';

type RowWithBounds = {
  row: DeepReadonly<StackViewRow>;
  bounds: BoundingBox;
};

export default Vue.extend({
  name: 'StackViewItemRows',
  components: {
    StackViewItemRow,
    CanvasSelector,
    StackViewItemRowDivider
  },
  props: {
    rows: {
      type: Array as PropType<StackViewItem['rows']>,
      required: true
    },
    itemBounds: {
      type: Object as PropType<BoundingBox>,
      required: true
    },
    sectionTranslation: {
      type: Object as PropType<Translation>,
      required: true
    },
    stackViewActive: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    rowWithBounds (): RowWithBounds[] {
      const rowsWithBounds: RowWithBounds[] = [];
      let top: number = this.itemBounds.y;

      this.rows.forEach(rowUid => {
        const row = report.getters.findStackViewRow(rowUid);
        const bounds = {
          x: this.itemBounds.x,
          y: top,
          width: this.itemBounds.width,
          height: row.height
        };
        rowsWithBounds.push({ row, bounds });
        top += row.height;
      });

      return rowsWithBounds;
    }
  },
  methods: {
    activateRow (uid: StackViewRowUid) {
      report.actions.activateEntity({ uid, type: 'stack-view-row' });
    },
    isLastRow (index: number): boolean {
      return this.rows.length === index + 1;
    }
  }
});
</script>

<style scoped>
.th-stack-view-row-divider {
  stroke: #aaaaaa;
  pointer-events: none;
}
</style>
