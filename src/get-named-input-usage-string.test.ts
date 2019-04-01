import { getNamedInputUsageString } from './get-named-input-usage-string';
import { Input } from './types';
import redent = require('redent');

describe(getNamedInputUsageString.name, () => {
  it('creates a usage string for the provided input', () => {
    const input: Input<string> = {
      getValue() {
        return 'foo';
      },
      getDescription() {
        return `blah blah
        more blah`;
      },
      placeholder: '<foo>',
    };
    const firstPart = '[--inputName <foo>] : ';
    const firstLine = `${firstPart}blah blah`;
    const secondLine = redent('more blah', firstPart.length);
    expect(getNamedInputUsageString('inputName', input)).toBe(
      `${firstLine}\n${secondLine}`,
    );
  });

  it('does ok if getDescription returns undefined', () => {
    const input: Input<string> = {
      getValue() {
        return 'foo';
      },
      getDescription() {
        return undefined;
      },
      placeholder: '<bar>',
    };
    const firstPart = '[--name <bar>]';
    expect(getNamedInputUsageString('name', input)).toBe(firstPart);
  });
});
