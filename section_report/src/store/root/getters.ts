import { GettersBase } from '../base/getters-base';
import { Modules } from '.';
import { RootState } from '@/types';

export class Getters extends GettersBase<RootState> {
  protected readonly modules: Modules;

  constructor (stateAccessor: () => RootState, modules: Modules) {
    super(stateAccessor);
    this.modules = modules;
  }
}
