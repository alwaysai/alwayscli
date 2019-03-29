import { Value } from '../types';
import { createNumberArrayOption } from './create-number-array-option';

const option = createNumberArrayOption({ description: 'foo bar baz' });

describe(createNumberArrayOption.name, () => {
  it('getValue result is argv converted to numbers', () => {
    expect(option.getValue(['0', '1', '2'])).toEqual([0, 1, 2]);
  });

  it('getValue result is undefined if argv is', () => {
    expect(option.getValue(undefined)).toBe(undefined);
  });

  it('getValue result type is number[] | undefined', () => {
    // $ExpectType number[] | undefined
    [] as Value<typeof option.getValue>;
  });

  it('getDescription returns description', () => {
    expect(option.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createNumberArrayOption().getDescription!()).toBe(undefined);
  });
});
