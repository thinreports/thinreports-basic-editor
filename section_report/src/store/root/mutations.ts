import { MutationsBase } from '../base/mutations-base';
import { Modules } from '.';
import { RootState, Report } from '@/types';

export class Mutations extends MutationsBase<RootState> {
  protected readonly modules: Modules;

  constructor (stateAccessor: () => RootState, modules: Modules) {
    super(stateAccessor);
    this.modules = modules;
  }

  setReport (report: Report) {
    this.state.report = report;
  }
};
