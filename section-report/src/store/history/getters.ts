import { GettersBase } from '../base/getters-base';
import { History } from '@/types';

export class Getters extends GettersBase<History> {
  undoable (): boolean {
    return this.state.pointer !== null && this.state.pointer > 0;
  }

  redoable (): boolean {
    return this.state.pointer !== null && this.state.histories.length > this.state.pointer + 1;
  }
}
