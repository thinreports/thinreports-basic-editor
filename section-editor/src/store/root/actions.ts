import { DeepReadonly } from 'utility-types';
import { ActionsBase } from '../base/actions-base';
import decodeSchema from '../lib/layout-schema/decode';
import { Getters } from './getters';
import { Mutations } from './mutations';
import { Modules } from '.';
import { RootState } from '@/types';

export class Actions extends ActionsBase<RootState, Getters, Mutations> {
  protected readonly modules: Modules;

  constructor (stateAccessor: () => DeepReadonly<RootState>, getters: Getters, mutations: Mutations, modules: Modules) {
    super(stateAccessor, getters, mutations);
    this.modules = modules;
  }

  loadSchema (schemaJson: string, filename: string) {
    const schema = JSON.parse(schemaJson);

    this.mutations.setReport({
      ...decodeSchema(schema),
      activeEntity: null
    });

    const { metadata, history, report } = this.modules;

    history.actions.set(report.state);
    metadata.actions.set({
      filename,
      lastSavedHistoryPointer: history.state.pointer
    });
  }

  saveSchema (filename?: string) {
    const { metadata, history } = this.modules;
    metadata.actions.update({
      filename,
      lastSavedHistoryPointer: history.state.pointer
    });
  }
};
