import { DeepReadonly } from 'utility-types';
import { ActionsBase } from '../base/actions-base';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { root } from '..';
import { History, Report } from '@/types';

export class Actions extends ActionsBase<History, Getters, Mutations> {
  push (report: DeepReadonly<Report>) {
    this.mutations.push(JSON.stringify(report));
  }

  replaceCurrentPointer (report: DeepReadonly<Report>) {
    if (this.state.pointer === null) return;

    this.mutations.replaceCurrentPointer(JSON.stringify(report));
  }

  undo () {
    if (this.state.pointer === null || this.state.pointer === 0) return;

    const history = this.state.histories[this.state.pointer - 1];
    root.mutations.setReport(JSON.parse(history));

    this.mutations.backPointer();
  }

  redo () {
    if (this.state.pointer === null || this.state.histories.length <= this.state.pointer + 1) return;

    const history = this.state.histories[this.state.pointer + 1];
    root.mutations.setReport(JSON.parse(history));

    this.mutations.forwardPointer();
  }

  reset () {
    this.mutations.clear();
  }

  set (report: DeepReadonly<Report>) {
    this.reset();
    this.push(report);
  }
};
