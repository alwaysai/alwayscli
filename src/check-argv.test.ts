import { checkHasValue, checkNotTooManyValues } from './check-argv';

describe(checkHasValue.name, () => {
  it('throws "no value" if no value is provided', () => {
    expect(() => checkHasValue([])).toThrow(/no value/i);
  });
});

describe(checkNotTooManyValues.name, () => {
  it('throws "Too many" if more than one value is provided', () => {
    expect(() => checkNotTooManyValues(['a', 'b'])).toThrow(/too many/i);
  });
});
