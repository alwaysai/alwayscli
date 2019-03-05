import { Result } from '../types';
import { createFlagOption } from './create-flag-option';

const option = createFlagOption({ description: 'foo bar baz' });

describe(createFlagOption.name, () => {
  it('getValue returns false if flag was not provided', () => {
    expect(option.getValue(undefined)).toBe(false);
  });

  it('getValue returns true if flag was provided with zero values', () => {
    expect(option.getValue([])).toBe(true);
  });

  it('getValue result type is boolean', () => {
    // $ExpectType boolean
    true as Result<typeof option.getValue>;
  });

  it('getDescription returns description', () => {
    expect(option.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createFlagOption().getDescription!()).toBe(undefined);
  });
});
