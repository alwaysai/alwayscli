import { runAndCatch } from '@carnesen/run-and-catch';
import { USAGE } from './cli-usage-error';
import { CliStringInput } from './cli-string-input';

const description = 'foo bar baz';
const hidden = true;
const placeholder = '<special>';
const required = false;

const input = CliStringInput({ required, description, hidden, placeholder });

describe(CliStringInput.name, () => {
  it('returns `undefined` if argv is `undefined` and no defaultValue has been provided', () => {
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('returns defaultValue if argv is `undefined` and defaultValue has been provided', () => {
    const input = CliStringInput({ defaultValue: '0' });
    expect(input.getValue(undefined)).toBe('0');
  });

  it('getValue returns the zeroth element of argv', () => {
    expect(input.getValue(['1'])).toBe('1');
  });

  it('throws UsageError "expected just one" if argv has more than one element', async () => {
    const exception = await runAndCatch(input.getValue, ['0', '1']);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(/expected just one/i);
    expect(exception.message).toMatch(placeholder);
  });

  it('throws UsageError "expected a" if argv is an empty array', async () => {
    const exception = await runAndCatch(input.getValue, []);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(/expected a/i);
    expect(exception.message).toMatch(placeholder);
  });

  it('attaches config properties', () => {
    expect(input.description).toBe(description);
    expect(input.hidden).toBe(hidden);
    expect(input.placeholder).toBe(placeholder);
    expect(input.required).toBe(required);
  });

  it('config is not required', () => {
    CliStringInput();
  });
});
