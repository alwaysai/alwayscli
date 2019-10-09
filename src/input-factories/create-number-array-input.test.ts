import { InputValue } from '../types';
import { createNumberArrayInput } from './create-number-array-input';

const input = createNumberArrayInput({ description: 'foo bar baz' });

describe(createNumberArrayInput.name, () => {
  it('getValue result is argv converted to numbers', () => {
    expect(input.getValue(['0', '1', '2'])).toEqual([0, 1, 2]);
  });

  it('getValue result is undefined if argv is', () => {
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('getValue result type is number[] | undefined', () => {
    // $ExpectType number[] | undefined
    [] as InputValue<typeof input>;
  });

  it('description is description', () => {
    expect(input.description).toBe('foo bar baz');
  });
});
