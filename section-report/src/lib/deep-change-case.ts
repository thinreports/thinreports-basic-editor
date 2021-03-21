import { camelCase } from 'camel-case';
import kebabCase from 'kebab-case';

const deepChangeCase = (data: unknown, converter: (arg: any) => string): unknown => {
  if (Array.isArray(data)) {
    return data.map(d => deepChangeCase(d, converter));
  }

  if (typeof data === 'object') {
    if (data === null) {
      return data;
    }

    const keys = Object.keys(data);
    if (!keys.length) {
      return data;
    }

    return keys.reduce((obj: { [keys: string]: unknown }, key: string) => {
      obj[converter(key)] = deepChangeCase((data as any)[key], converter);
      return obj;
    }, {});
  }

  return data;
};

export const deepChangeToKebabCase = (data: unknown) => {
  return deepChangeCase(data, kebabCase);
};

export const deepChangeToCamelCase = (data: unknown) => {
  return deepChangeCase(data, camelCase);
};
