import { GettersBase } from '../base/getters-base';
import { Editor } from '@/types';

export class Getters extends GettersBase<Editor> {
  isSelectMode () {
    return this.state.activeTool === 'select';
  }

  isDrawMode () {
    return this.state.activeTool !== 'select';
  }

  zoomRate () {
    return this.state.zoomRate;
  }
}
