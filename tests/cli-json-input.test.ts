import { runAndCatch } from '@carnesen/run-and-catch';
import { CliJsonInput } from '../src/cli-json-input';
import { CLI_USAGE_ERROR } from '../src/cli-usage-error';

const description = 'foo bar baz';
const hidden = true;
const placeholder = '<special>';
const required = true;

const input = CliJsonInput({ description, hidden, placeholder, required });

describe(CliJsonInput.name, () => {
  it('getValue returns undefined if argv is undefined', () => {
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('getValue returns parsed JSON if argv is an array with one JSON-parsable string', () => {
    expect(input.getValue(['"foo"'])).toBe('foo');
  });

  it('getValue throws a usage error "expected a single" if argv is an array with zero or more than one items', async () => {
    for (const argv of [[], ['', '']]) {
      const exception = await runAndCatch(input.getValue, argv);
      expect(exception.code).toBe(CLI_USAGE_ERROR);
      expect(exception.message).toMatch(/expected a single/i);
      expect(exception.message).toMatch(placeholder);
    }
  });

  it('getValue throws a good usage error if the string in argv is not parsable', async () => {
    const exception = await runAndCatch(input.getValue, ['foo']);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/Unexpected token/);
  });

  it('attaches config properties', () => {
    expect(input.description).toBe(description);
    expect(input.hidden).toBe(hidden);
    expect(input.placeholder).toBe(placeholder);
    expect(input.required).toBe(required);
  });

  it('config is optional', () => {
    expect(CliJsonInput().hidden).toBe(false);
  });
});
