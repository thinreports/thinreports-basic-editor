import { deepChangeToKebabCase, deepChangeToCamelCase } from '@/lib/deep-change-case';

describe('deep-change-case', () => {
  it('convert to camelcase', () => {
    expect(deepChangeToCamelCase(
      {
        foo: 1,
        'foo-bar': {
          foo: 1,
          'foo-bar': 2,
          'foo-bar-baz': 3,
          bar: [
            {
              foo: 1,
              'foo-bar': 2,
              'foo-bar-baz': 3
            }
          ]
        },
        'foo-bar-baz': [
          {
            foo: 1,
            'foo-bar': 2,
            'foo-bar-baz': 3
          },
          [
            {
              foo: 1,
              'foo-bar': 2,
              'foo-bar-baz': 3
            }
          ]
        ],
        null: null,
        undefined: undefined,
        empty: {}
      }
    )).toStrictEqual(
      {
        foo: 1,
        fooBar: {
          foo: 1,
          fooBar: 2,
          fooBarBaz: 3,
          bar: [
            {
              foo: 1,
              fooBar: 2,
              fooBarBaz: 3
            }
          ]
        },
        fooBarBaz: [
          {
            foo: 1,
            fooBar: 2,
            fooBarBaz: 3
          },
          [
            {
              foo: 1,
              fooBar: 2,
              fooBarBaz: 3
            }
          ]
        ],
        null: null,
        undefined: undefined,
        empty: {}
      }
    );

    expect(deepChangeToCamelCase('foo')).toStrictEqual('foo');
    expect(deepChangeToCamelCase({})).toStrictEqual({});
    expect(deepChangeToCamelCase(null)).toStrictEqual(null);
    expect(deepChangeToCamelCase(undefined)).toStrictEqual(undefined);
  });

  it('convert to kebabcase', () => {
    expect(deepChangeToKebabCase(
      {
        foo: 1,
        fooBar: {
          foo: 1,
          fooBar: 2,
          fooBarBaz: 3,
          bar: [
            {
              foo: 1,
              fooBar: 2,
              fooBarBaz: 3
            }
          ]
        },
        fooBarBaz: [
          {
            foo: 1,
            fooBar: 2,
            fooBarBaz: 3
          },
          [
            {
              foo: 1,
              fooBar: 2,
              fooBarBaz: 3
            }
          ]
        ],
        null: null,
        undefined: undefined,
        empty: {}
      }
    )).toStrictEqual(
      {
        foo: 1,
        'foo-bar': {
          foo: 1,
          'foo-bar': 2,
          'foo-bar-baz': 3,
          bar: [
            {
              foo: 1,
              'foo-bar': 2,
              'foo-bar-baz': 3
            }
          ]
        },
        'foo-bar-baz': [
          {
            foo: 1,
            'foo-bar': 2,
            'foo-bar-baz': 3
          },
          [
            {
              foo: 1,
              'foo-bar': 2,
              'foo-bar-baz': 3
            }
          ]
        ],
        null: null,
        undefined: undefined,
        empty: {}
      }
    );

    expect(deepChangeToCamelCase('foo')).toStrictEqual('foo');
    expect(deepChangeToCamelCase({})).toStrictEqual({});
    expect(deepChangeToCamelCase(null)).toStrictEqual(null);
    expect(deepChangeToCamelCase(undefined)).toStrictEqual(undefined);
  });
});
