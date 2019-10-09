import { InputValue } from '../types';
import { CliFlagInput } from './cli-flag-input';

const input = CliFlagInput({ description: 'foo bar baz' });

describe(CliFlagInput.name, () => {
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

  it('description is description', () => {
    expect(input.description).toBe('foo bar baz');
  });

  it('description is undefined if there is no description', () => {
    expect(CliFlagInput().description).toBe(undefined);
  });
});
