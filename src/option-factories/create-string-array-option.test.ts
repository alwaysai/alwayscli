import { Value } from '../types';
import { createStringArrayOption } from './create-string-array-option';
import { runAndCatch } from '@carnesen/run-and-catch';

const option = createStringArrayOption({ description: 'foo bar baz' });

describe(createStringArrayOption.name, () => {
  it('returns the whole of argv', () => {
    expect(option.getValue(['foo', 'bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });

  it('returns undefined if argv is', () => {
    expect(option.getValue(undefined)).toBe(undefined);
  });

  it('throws FATAL error on length-zero array', async () => {
    const ex = await runAndCatch(option.getValue, []);
    expect(ex.message).toMatch(/Expected one or more values/i);
    expect(ex.code).toBe('FATAL');
  });

  it('getValue result type is string[] | undefined', () => {
    // $ExpectType string[] | undefined
    [] as Value<typeof option.getValue>;
  });

  it('getDescription returns description', () => {
    expect(option.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createStringArrayOption().getDescription!()).toBe(undefined);
  });
});
