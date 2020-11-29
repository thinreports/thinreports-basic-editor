import { ActionsBase } from '../base/actions-base';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Operator, ItemDrawer, ItemDragger } from '@/types';

export class Actions extends ActionsBase<Operator, Getters, Mutations> {
  startItemDraw (payload: Omit<ItemDrawer, 'active'>) {
    this.mutations.setItemDrawer({ ...payload, active: true });
  }

  finishItemDraw () {
    this.mutations.resetItemDrawer();
  }

  startItemDrag (payload: Omit<ItemDragger, 'active'>) {
    this.mutations.setItemDragger({ ...payload, active: true });
  }

  finishItemDrag () {
    this.mutations.resetItemDragger();
  }
};
