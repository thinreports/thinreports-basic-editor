import { ActionsBase } from '../base/actions-base';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { calcPlus, calcMinus } from '@/lib/strict-calculator';
import { Editor, ToolType, CopiedAnyItem } from '@/types';

export class Actions extends ActionsBase<Editor, Getters, Mutations> {
  activateTool ({ tool }: { tool: ToolType }) {
    this.mutations.setActiveTool({ tool });
  }

  setClipboard (item: CopiedAnyItem) {
    if (!item) return;

    this.mutations.setClipboard(item);
  }

  setZoomRate (rate: number) {
    this.mutations.setZoomRate(rate);
  }

  resetZoom () {
    this.mutations.setZoomRate(1.2);
  }

  zoomIn () {
    this.mutations.setZoomRate(calcPlus(this.state.zoomRate, 0.5));
  }

  zoomOut () {
    this.mutations.setZoomRate(calcMinus(this.state.zoomRate, 0.5));
  }
};
