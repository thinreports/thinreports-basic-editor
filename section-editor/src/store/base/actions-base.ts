import { DeepReadonly } from 'utility-types';
import { GettersBase } from './getters-base';
import { MutationsBase } from './mutations-base';

export class ActionsBase<T, G extends GettersBase<T>, M extends MutationsBase<T>> {
  protected readonly stateAccessor: () => DeepReadonly<T>;
  protected readonly getters: G;
  protected readonly mutations: M;

  constructor (stateAccessor: () => DeepReadonly<T>, getters: G, mutations: M) {
    this.stateAccessor = stateAccessor;
    this.getters = getters;
    this.mutations = mutations;
  }

  protected get state (): DeepReadonly<T> {
    return this.stateAccessor() as DeepReadonly<T>;
  }
};
