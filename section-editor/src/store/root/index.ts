import { StoreBase } from '../base/store-base';

import { Store as EditorStore } from '../editor';
import { Store as HistoryStore } from '../history';
import { Store as MetadataStore } from '../metadata';
import { Store as OperatorStore } from '../operator';
import { Store as ReportStore } from '../report';
import { Actions } from './actions';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { RootState } from '@/types';

export type Modules = {
  report: ReportStore;
  history: HistoryStore;
  operator: OperatorStore;
  editor: EditorStore;
  metadata: MetadataStore;
}

export class Store extends StoreBase<RootState> {
  readonly modules!: Modules;
  readonly getters: Getters;
  readonly mutations: Mutations;
  readonly actions: Actions;

  constructor (stateAccessor: () => RootState, modules: Modules) {
    super(stateAccessor);
    this.getters = new Getters(stateAccessor, modules);
    this.mutations = new Mutations(stateAccessor, modules);
    this.actions = new Actions(stateAccessor, this.getters, this.mutations, modules);
    this.modules = modules;
  }
};
