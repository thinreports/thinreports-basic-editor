import { StoreBase } from '../base/store-base';
import { Actions } from './actions';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Operator } from '@/types';

export class Store extends StoreBase<Operator> {
  readonly getters: Getters;
  readonly mutations: Mutations;
  readonly actions: Actions;

  constructor (stateAccessor: () => Operator) {
    super(stateAccessor);
    this.getters = new Getters(stateAccessor);
    this.mutations = new Mutations(stateAccessor);
    this.actions = new Actions(stateAccessor, this.getters, this.mutations);
  }

  static createState (): Operator {
    return {
      itemDrawer: {
        active: false,
        itemType: null,
        targetType: null,
        targetUid: null,
        translation: null
      },
      itemDragger: {
        active: false,
        itemUid: null,
        translation: null
      }
    };
  }
};
