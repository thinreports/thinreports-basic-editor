import { StoreBase } from '../base/store-base';
import { Actions } from './actions';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Metadata } from '@/types';

export class Store extends StoreBase<Metadata> {
  readonly getters: Getters;
  readonly mutations: Mutations;
  readonly actions: Actions;

  constructor (stateAccessor: () => Metadata) {
    super(stateAccessor);
    this.getters = new Getters(stateAccessor);
    this.mutations = new Mutations(stateAccessor);
    this.actions = new Actions(stateAccessor, this.getters, this.mutations);
  }

  static createState (): Metadata {
    return {
      filename: null,
      lastSavedHistoryPointer: 0
    };
  }
};
