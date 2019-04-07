import { NamedInputValues } from '../types';
import { createOneOfInput } from './create-one-of-input';

describe(createOneOfInput.name, () => {
  it('returns the zeroth element of argv', () => {
    const input = createOneOfInput({ values: ['foo', 'bar'] });
    expect(input.getValue(['foo'])).toBe('foo');
  });

  it('returns undefined if argv is', () => {
    const input = createOneOfInput({ values: ['foo', 'bar'] });
    expect(input.getValue(undefined)).toBe(undefined);
  });

  it('results in a NamedArg of type `U[number] | undefined`', () => {
    const namedInputs = {
      oneOf: createOneOfInput({
        values: ['foo' as 'foo', 'bar' as 'bar'],
      }),
    };
    const namedArgs: NamedInputValues<typeof namedInputs> = {
      oneOf: undefined,
    };

    // $ExpectType "foo" | "bar" | undefined
    namedArgs.oneOf;
  });

  it('results in a NamedArg of type `U[number]` if required is true', () => {
    const namedInputs = {
      oneOf: createOneOfInput({
        values: ['foo' as 'foo', 'bar' as 'bar'],
        required: true,
      }),
    };
    const namedArgs: NamedInputValues<typeof namedInputs> = {
      oneOf: 'foo',
    };

    // $ExpectType "foo" | "bar"
    namedArgs.oneOf;
  });
});
