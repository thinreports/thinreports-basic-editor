export class MutationsBase<T> {
  protected readonly stateAccessor: () => T;

  constructor (stateAccessor: () => T) {
    this.stateAccessor = stateAccessor;
  }

  protected get state (): T {
    return this.stateAccessor();
  }
};
