import { CliNumberArrayInput } from './cli-number-array-input';
import { runAndCatch } from '@carnesen/run-and-catch';
import { CLI_USAGE_ERROR } from './cli-usage-error';

const description = 'foo bar baz';
const hidden = true;
const placeholder = '<special>';
const required = false;

const input = CliNumberArrayInput({ description, hidden, placeholder, required });

describe(CliNumberArrayInput.name, () => {
  it('getValue returns is argv converted to numbers', () => {
    expect(input.getValue(['0', '1', '2'])).toEqual([0, 1, 2]);
  });

  it('getValue returns `undefined` if argv is', () => {
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('getValue throws USAGE error "expected one or more" if argv is an empty array', async () => {
    const exception = await runAndCatch(input.getValue, []);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/expected one or more/i);
    expect(exception.message).toMatch(placeholder);
  });

  it('attaches config properties', () => {
    expect(input.description).toBe(description);
    expect(input.hidden).toBe(hidden);
    expect(input.placeholder).toBe(placeholder);
    expect(input.required).toBe(required);
  });

  it('config is not required', () => {
    CliNumberArrayInput();
  });
});
