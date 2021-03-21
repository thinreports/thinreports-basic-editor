import { MutationsBase } from '../base/mutations-base';
import { Metadata } from '@/types';

export class Mutations extends MutationsBase<Metadata> {
  setFilename (filename: string | null) {
    this.state.filename = filename;
  }

  setHistoryPointer (pointer: number | null) {
    this.state.lastSavedHistoryPointer = pointer;
  }
};
