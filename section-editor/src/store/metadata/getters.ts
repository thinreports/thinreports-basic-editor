import { history } from '..';
import { GettersBase } from '../base/getters-base';
import { Metadata } from '@/types';

export class Getters extends GettersBase<Metadata> {
  isNew () {
    return this.state.filename === null;
  }

  filename () {
    return this.state.filename;
  }

  isDarty () {
    return this.isNew() || history.state.pointer !== this.state.lastSavedHistoryPointer;
  }
}
