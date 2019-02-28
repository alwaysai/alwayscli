import { NamedArgs } from '../types';
import { createStringOption } from './create-string-option';

describe(createStringOption.name, () => {
  it('returns the zeroth element of argv', () => {
    const option = createStringOption();
    expect(option.getValue(['foo'])).toBe('foo');
  });

  it('returns undefined if argv is', () => {
    const option = createStringOption();
    expect(option.getValue()).toBe(undefined);
  });

  it('results in a NamedArg of type `string | undefined`', () => {
    const options = {
      stringOption: createStringOption({ description: 'A string option' }),
    };
    const namedArgs: NamedArgs<typeof options> = {
      stringOption: undefined,
    };
    // $ExpectType string | undefined
    namedArgs.stringOption;
  });
});
