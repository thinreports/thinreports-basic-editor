import { Actions } from '../report/actions';
import { root } from '..';

let lock = false;

type Option = {
  replace?: boolean;
};

export function SaveHistory (option?: { replaceCurrentPointer: boolean }) {
  return function (_target: unknown, _propertyKey: unknown, descriptor: PropertyDescriptor) {
    const originalFunction = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = function (this: Actions, ...args: any[]) {
      const lockedByCurrentProcess = !lock;
      lock = true;

      const ret = originalFunction.apply(this, args);

      if (lockedByCurrentProcess) {
        if (option && option.replaceCurrentPointer) {
          root.modules.history.actions.replaceCurrentPointer(root.modules.report.state);
        } else {
          root.modules.history.actions.push(root.modules.report.state);
        }

        lock = false;
      }

      return ret;
    };

    return descriptor;
  };
};
