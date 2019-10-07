import { Input } from './types';
import { accumulateNamedValues } from './accumulate-options-values';

const UNDEFINED_WAS_PASSED = 'undefined was passed';

const input: Input<string, false> = {
  placeholder: '<foo>',
  getValue(argv) {
    if (typeof argv === 'undefined') {
      return UNDEFINED_WAS_PASSED;
    }
    return argv[0];
  },
  getDescription: () => '',
};

const requiredInput: Input<string, true> = {
  placeholder: '<foo>',
  required: true,
  getValue() {
    return 'carl';
  },
  getDescription: () => '',
};

describe(accumulateNamedValues.name, () => {
  it(`returns error message if input is "required" but argv is empty`, async () => {
    // const result = await accumulateOptionsValues(requiredInput, []);
    // expect(result.errorMessage).toMatch(/required/i);
    // expect(result.errorMessage).toMatch(requiredInput.placeholder);
  });
});
