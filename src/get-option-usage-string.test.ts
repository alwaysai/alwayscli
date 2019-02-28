import { getOptionUsageString } from './get-option-usage-string';
import { Option } from './types';
import redent = require('redent');

describe(getOptionUsageString.name, () => {
  it('creates a usage string for the provided option', () => {
    const option: Option<string> = {
      getValue() {
        return 'foo';
      },
      getDescription() {
        return `blah blah
        more blah`;
      },
      placeholder: '<foo>',
    };
    const firstPart = '--optionName <foo> : ';
    const firstLine = `${firstPart}blah blah`;
    const secondLine = redent('more blah', firstPart.length);
    expect(getOptionUsageString('optionName', option)).toBe(
      `${firstLine}\n${secondLine}`,
    );
  });

  it('does ok if getDescription returns undefined', () => {
    const option: Option<string> = {
      getValue() {
        return 'foo';
      },
      getDescription() {
        return undefined;
      },
      placeholder: '<bar>',
    };
    const firstPart = '--optionName <bar>';
    expect(getOptionUsageString('optionName', option)).toBe(firstPart);
  });
});
