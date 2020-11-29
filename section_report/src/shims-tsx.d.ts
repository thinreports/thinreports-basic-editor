// FIXME: Vue and VNode are reported as no-unused-vars error by the following bug for typescript-eslint
// https://github.com/typescript-eslint/typescript-eslint/issues/1596
//
// This bug will be fixed in https://github.com/typescript-eslint/typescript-eslint/issues/1856.
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
