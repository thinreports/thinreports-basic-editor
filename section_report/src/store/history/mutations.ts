import { MutationsBase } from '../base/mutations-base';
import { History } from '@/types';

export class Mutations extends MutationsBase<History> {
  push (stringifiedReport: string) {
    const isFirstHistory = this.state.pointer === null;
    const pointer = isFirstHistory ? 0 : this.state.pointer!;

    // FIXME: Reduce memory usage. In particular, improve the memory usage of images.
    this.state.histories = [...this.state.histories.slice(0, pointer + 1), stringifiedReport];

    this.state.pointer = isFirstHistory ? pointer : pointer + 1;
  }

  replaceCurrentPointer (stringifiedReport: string) {
    if (this.state.pointer === null) return;
    this.state.histories.splice(this.state.pointer, 1, stringifiedReport);
  }

  backPointer () {
    if (this.state.pointer === null || this.state.pointer === 0) return;

    this.state.pointer = this.state.pointer - 1;
  }

  forwardPointer () {
    if (this.state.pointer === null || this.state.histories.length <= this.state.pointer + 1) return;

    this.state.pointer = this.state.pointer + 1;
  }

  clear () {
    this.state.histories = [];
    this.state.pointer = null;
  }
};
