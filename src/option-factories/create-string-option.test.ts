import { NamedArgs } from '../types';
import { createStringOption } from './create-string-option';

describe(createStringOption.name, () => {
  it('returns the zeroth element of argv', () => {
    const option = createStringOption();
    expect(option.getValue(['foo'])).toBe('foo');
  });

  it('returns undefined if argv is', () => {
    const option = createStringOption();
    expect(option.getValue(undefined)).toBe(undefined);
  });

  it('returns defaultValue if argv is undefined', () => {
    const option = createStringOption({ defaultValue: 'foo' });
    expect(option.getValue(undefined)).toBe('foo');
  });

  it('normally results in a NamedArg of type `string | undefined`', () => {
    const options = {
      stringOption: createStringOption({ description: 'A string option' }),
    };
    const namedArgs: NamedArgs<typeof options> = {
      stringOption: undefined,
    };
    // $ExpectType string | undefined
    namedArgs.stringOption;
  });

  it('results in a NamedArg of type `string` if required is true', () => {
    const options = {
      stringOption: createStringOption({ required: true }),
    };
    const namedArgs: NamedArgs<typeof options> = {
      stringOption: 'foo',
    };
    // $ExpectType string
    namedArgs.stringOption;
  });

  it('results in a NamedArg of type `string` if a defaultValue is provided', () => {
    const options = {
      stringOption: createStringOption({ defaultValue: 'foo' }),
    };
    const namedArgs: NamedArgs<typeof options> = {
      stringOption: 'bar',
    };
    // $ExpectType string
    namedArgs.stringOption;
  });
});
