import { convertToNumber } from './util';

describe(convertToNumber.name, () => {
  it('converts the provided string to a number', () => {
    expect(convertToNumber('1')).toBe(1);
  });

  it('throws a usage error if the string value cannot be converted', () => {
    try {
      convertToNumber('foo');
      throw new Error('This line should never be reached');
    } catch (ex) {
      expect(ex.code).toBe('USAGE');
      expect(ex.message).toMatch('not a number');
    }
  });
});
