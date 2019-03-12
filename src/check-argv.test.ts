import { checkArgvHasValue, checkArgvLengthLessThan } from './check-argv';

describe(checkArgvHasValue.name, () => {
  it('throws "no value" if no value is provided', () => {
    expect(() => checkArgvHasValue([])).toThrow(/no value/i);
  });
});

describe(checkArgvLengthLessThan.name, () => {
  it('throws "Too many" if more than one value is provided', () => {
    expect(() => checkArgvLengthLessThan(['a', 'b'])).toThrow(/too many/i);
  });
});
