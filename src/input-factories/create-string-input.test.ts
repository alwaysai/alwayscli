import { NamedValues } from '../types';
import { createStringInput } from './create-string-input';

describe(createStringInput.name, () => {
  it('returns the zeroth element of argv', () => {
    const input = createStringInput();
    expect(input.getValue(['foo'])).toBe('foo');
  });

  it('returns undefined if argv is', () => {
    const input = createStringInput();
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('returns defaultValue if argv is undefined', () => {
    const input = createStringInput({ defaultValue: 'foo' });
    expect(input.getValue(undefined)).toBe('foo');
  });

  it('normally results in a NamedValues of type `string | undefined`', () => {
    const namedInputs = {
      str: createStringInput(),
    };
    const namedValues: NamedValues<typeof namedInputs> = {
      str: undefined,
    };
    // $ExpectType string | undefined
    namedValues.str;
  });

  it('results in a NamedArg of type `string` if required is true', () => {
    const namedInputs = {
      str: createStringInput({ required: true }),
    };
    const namedValues: NamedValues<typeof namedInputs> = {
      str: 'foo',
    };
    // $ExpectType string
    namedValues.str;
  });

  it('results in a NamedArg of type `string` if a defaultValue is provided', () => {
    const namedInputs = {
      str: createStringInput({ defaultValue: 'foo' }),
    };
    const namedValues: NamedValues<typeof namedInputs> = {
      str: 'bar',
    };
    // $ExpectType string
    namedValues.str;
  });
});
