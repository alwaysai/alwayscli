import { InputValue } from '../types';
import { createStringArrayInput } from './create-string-array-input';
import { runAndCatch } from '@carnesen/run-and-catch';
import { USAGE } from '../usage-error';

const input = createStringArrayInput({ description: 'foo bar baz' });

describe(createStringArrayInput.name, () => {
  it('returns the whole of argv', () => {
    expect(input.getValue(['foo', 'bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });

  it('returns undefined if argv is', () => {
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it(`throws "${USAGE}" error on length-zero array`, async () => {
    const ex = await runAndCatch(input.getValue, []);
    expect(ex.message).toMatch(/Expected one or more values/i);
    expect(ex.code).toBe(USAGE);
  });

  it('getValue result type is string[] | undefined', () => {
    // $ExpectType string[] | undefined
    [] as InputValue<typeof input.getValue>;
  });

  it('getDescription returns description', () => {
    expect(input.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createStringArrayInput().getDescription!()).toBe(undefined);
  });
});
