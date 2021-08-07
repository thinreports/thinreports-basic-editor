import { DeepReadonly } from 'utility-types';

export abstract class StoreBase<T> {
  protected readonly stateAccessor: () => T;

  constructor (stateAccessor: () => T) {
    this.stateAccessor = stateAccessor;
  }

  get state () {
    return this.stateAccessor() as DeepReadonly<T>;
  }
};
