import { StoreBase } from '../base/store-base';
import { Actions } from './actions';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Editor } from '@/types';

export class Store extends StoreBase<Editor> {
  readonly getters: Getters;
  readonly mutations: Mutations;
  readonly actions: Actions;

  constructor (stateAccessor: () => Editor) {
    super(stateAccessor);
    this.getters = new Getters(stateAccessor);
    this.mutations = new Mutations(stateAccessor);
    this.actions = new Actions(stateAccessor, this.getters, this.mutations);
  }

  static createState (): Editor {
    return {
      activeTool: 'select',
      clipboard: null,
      zoomRate: 1.2
    };
  }
};
