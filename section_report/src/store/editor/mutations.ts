import { MutationsBase } from '../base/mutations-base';
import { CopiedAnyItem, Editor, ToolType } from '@/types';

export class Mutations extends MutationsBase<Editor> {
  setActiveTool ({ tool }: { tool: ToolType}) {
    this.state.activeTool = tool;
  }

  setClipboard (item: CopiedAnyItem) {
    this.state.clipboard = item;
  }

  setZoomRate (rate: number) {
    this.state.zoomRate = Math.max(rate, 0.5);
  }
};
