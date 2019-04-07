import { InputValue } from '../types';
import { createFlagInput } from './create-flag-input';

const input = createFlagInput({ description: 'foo bar baz' });

describe(createFlagInput.name, () => {
  it('getValue returns false if flag was not provided', () => {
    expect(input.getValue(undefined)).toBe(false);
  });

  it('getValue returns true if flag was provided with zero values', () => {
    expect(input.getValue([])).toBe(true);
  });

  it('getValue result type is boolean', () => {
    // $ExpectType boolean
    true as InputValue<typeof input>;
  });

  it('getDescription returns description', () => {
    expect(input.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createFlagInput().getDescription!()).toBe(undefined);
  });
});
