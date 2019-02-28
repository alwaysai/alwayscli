import { NamedArgs } from '../types';
import { createStringEnumOption } from './create-string-enum-option';

describe(createStringEnumOption.name, () => {
  it('returns the zeroth element of argv', () => {
    const option = createStringEnumOption({ allowedValues: ['foo', 'bar'] });
    expect(option.getValue(['foo'])).toBe('foo');
  });

  it('returns undefined if argv is', () => {
    const option = createStringEnumOption({ allowedValues: ['foo', 'bar'] });
    expect(option.getValue()).toBe(undefined);
  });

  it('results in a NamedArg of type `U[number] | undefined`', () => {
    const options = {
      stringOption: createStringEnumOption({
        allowedValues: ['foo' as 'foo', 'bar' as 'bar'],
      }),
    };
    const namedArgs: NamedArgs<typeof options> = {
      stringOption: undefined,
    };
    // $ExpectType "foo" | "bar" | undefined
    namedArgs.stringOption;
  });
});
