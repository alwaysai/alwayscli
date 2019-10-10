import { CliOneOfInput } from './cli-one-of-input';
import { runAndCatch } from '@carnesen/run-and-catch';
import { CLI_USAGE_ERROR } from './cli-usage-error';

const description = 'foo bar baz';
const hidden = true;
const placeholder = '<special>';
const required = false;

const input = CliOneOfInput({
  values: ['foo', 'bar'],
  description,
  hidden,
  placeholder,
  required,
});

describe(CliOneOfInput.name, () => {
  it('getValue returns the zeroth element of argv', () => {
    expect(input.getValue(['foo'])).toBe('foo');
  });

  it('getValue throws usage error "expected one of" if argv is an empty array', async () => {
    const exception = await runAndCatch(input.getValue, []);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/expected <special> to be one of/i);
    expect(exception.message).toMatch(/foo, bar/i);
  });

  it('getValue throws usage error "invalid argument ... expected one of" if argv has a bad value', async () => {
    const exception = await runAndCatch(input.getValue, ['baz']);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/expected <special> to be one of/i);
    expect(exception.message).toMatch(placeholder);
  });

  it('returns undefined if argv is', () => {
    const input = CliOneOfInput({ values: ['foo', 'bar'] });
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('attaches config properties', () => {
    expect(input.description).toMatch(description);
    expect(input.hidden).toBe(hidden);
    expect(input.placeholder).toBe(placeholder);
    expect(input.required).toBe(required);
  });
});
