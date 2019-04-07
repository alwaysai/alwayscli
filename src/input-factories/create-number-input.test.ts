import { NamedInputValues } from '../types';
import { createNumberInput } from './create-number-input';

describe(createNumberInput.name, () => {
  it('returns the zeroth element of argv', () => {
    const input = createNumberInput();
    expect(input.getValue(['1'])).toBe(1);
  });

  it('returns undefined if argv is', () => {
    const input = createNumberInput();
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('returns defaultValue if argv is undefined', () => {
    const input = createNumberInput({ defaultValue: 1 });
    expect(input.getValue(undefined)).toBe(1);
  });

  it('normally results in a NamedValues of type `number | undefined`', () => {
    const namedInputs = {
      num: createNumberInput(),
    };
    const namedValues: NamedInputValues<typeof namedInputs> = {
      num: undefined,
    };
    // $ExpectType number | undefined
    namedValues.num;
  });

  it('results in a NamedArg of type `number` if required is true', () => {
    const namedInputs = {
      num: createNumberInput({ required: true }),
    };
    const namedValues: NamedInputValues<typeof namedInputs> = {
      num: 1,
    };
    // $ExpectType number
    namedValues.num;
  });

  it('results in a NamedArg of type `number` if a defaultValue is provided', () => {
    const namedInputs = {
      num: createNumberInput({ defaultValue: 1 }),
    };
    const namedValues: NamedInputValues<typeof namedInputs> = {
      num: 2,
    };
    // $ExpectType number
    namedValues.num;
  });
});
