import { CLI_USAGE_ERROR, CliUsageError } from '../src/cli-usage-error';
import { convertToNumber, regularizeText } from '../src/util';

describe(convertToNumber.name, () => {
  it('converts the provided string to a number', () => {
    expect(convertToNumber('1')).toBe(1);
  });

  it('throws a usage error if the string value cannot be converted', () => {
    try {
      convertToNumber('foo');
      throw new Error('This line should never be reached');
    } catch (ex) {
      expect(ex).toBeInstanceOf(CliUsageError);
      if (ex instanceof CliUsageError) {
        expect(ex.code).toBe(CLI_USAGE_ERROR);
        expect(ex.message).toMatch(/not a number/);
      }
    }
  });
});

describe(regularizeText.name, () => {
  it('strips out a leading newline, trailing whitespace', () => {
    expect(regularizeText('\n   foo\n      bar\n   ')).toBe('foo\n   bar');
  });
});
