import Vue from 'vue';
import { Store as EditorStore } from './editor';
import { Store as HistoryStore } from './history';
import { Store as MetadataStore } from './metadata';
import { Store as OperatorStore } from './operator';
import { Store as ReportStore } from './report';
import { Store as RootStore } from './root';
import { RootState } from '@/types';

const rootState: RootState = Vue.observable({
  report: ReportStore.createState(),
  history: HistoryStore.createState(),
  operator: OperatorStore.createState(),
  editor: EditorStore.createState(),
  metadata: MetadataStore.createState()
});

export const report = new ReportStore(() => rootState.report);
export const history = new HistoryStore(() => rootState.history);
export const operator = new OperatorStore(() => rootState.operator);
export const editor = new EditorStore(() => rootState.editor);
export const metadata = new MetadataStore(() => rootState.metadata);
export const root = new RootStore(() => rootState, { report, history, operator, editor, metadata });
