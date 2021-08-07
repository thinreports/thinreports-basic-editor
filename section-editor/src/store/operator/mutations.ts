import { MutationsBase } from '../base/mutations-base';
import { Operator, ItemDrawer, ItemDragger } from '@/types';

export class Mutations extends MutationsBase<Operator> {
  setItemDrawer (payload: ItemDrawer) {
    this.state.itemDrawer = payload;
  }

  resetItemDrawer () {
    this.state.itemDrawer = {
      active: false,
      itemType: null,
      targetType: null,
      targetUid: null,
      translation: null
    };
  }

  setItemDragger (payload: ItemDragger) {
    this.state.itemDragger = payload;
  }

  resetItemDragger () {
    this.state.itemDragger = {
      active: false,
      itemUid: null,
      translation: null
    };
  }
};
