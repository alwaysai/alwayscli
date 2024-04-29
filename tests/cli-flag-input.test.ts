import { runAndCatch } from '@carnesen/run-and-catch';
import { CliFlagInput } from '../src/cli-flag-input';
import { CLI_USAGE_ERROR } from '../src/cli-usage-error';

const description = 'foo bar baz';
const hidden = true;

const input = CliFlagInput({ description, hidden });

describe(CliFlagInput.name, () => {
  it('always has "required" set to false', () => {
    expect(input.required).toBe(false);
  });

  it('getValue returns false if argv is undefined', () => {
    expect(input.getValue(undefined)).toBe(false);
  });

  it('getValue returns true if argv is an empty array', () => {
    expect(input.getValue([])).toBe(true);
  });

  it('getValue throws a usage error "unexpected argument" if argv has a value', async () => {
    const exception = await runAndCatch(input.getValue, ['foo']);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/unexpected argument/i);
    expect(exception.message).toMatch('"foo"');
  });

  it('attaches passed properties "description" and "hidden"', () => {
    expect(input.description).toBe(description);
    expect(input.hidden).toBe(hidden);
  });

  it('config is optional', () => {
    expect(CliFlagInput().hidden).toBe(false);
  });
});
