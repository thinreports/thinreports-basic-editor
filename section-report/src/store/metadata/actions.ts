import { Optional } from 'utility-types';
import { ActionsBase } from '../base/actions-base';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Metadata } from '@/types';

export class Actions extends ActionsBase<Metadata, Getters, Mutations> {
  set ({ filename, lastSavedHistoryPointer }: Metadata) {
    this.mutations.setFilename(filename);
    this.mutations.setHistoryPointer(lastSavedHistoryPointer);
  }

  update ({ filename, lastSavedHistoryPointer }: Optional<Metadata>) {
    if (filename) {
      this.mutations.setFilename(filename);
    }
    if (lastSavedHistoryPointer) {
      this.mutations.setHistoryPointer(lastSavedHistoryPointer);
    }
  }
};
