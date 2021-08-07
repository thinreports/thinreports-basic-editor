import { StoreBase } from '../base/store-base';
import { Actions } from './actions';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Report } from '@/types';

export class Store extends StoreBase<Report> {
  readonly getters: Getters;
  readonly mutations: Mutations;
  readonly actions: Actions;

  constructor (stateAccessor: () => Report) {
    super(stateAccessor);
    this.getters = new Getters(stateAccessor);
    this.mutations = new Mutations(stateAccessor);
    this.actions = new Actions(stateAccessor, this.getters, this.mutations);
  }

  static createState (): Report {
    return {
      type: 'section',
      title: '',
      paperType: 'A4',
      orientation: 'portrait',
      margin: [0, 0, 0, 0],
      width: 0,
      height: 0,
      sections: {
        headers: [],
        details: [],
        footers: []
      },
      entities: {
        sections: {} as Report['entities']['sections'],
        items: {} as Report['entities']['items'],
        stackViewRows: {} as Report['entities']['stackViewRows']
      },
      activeEntity: null,
      layoutGuides: []
    };
  }
};
