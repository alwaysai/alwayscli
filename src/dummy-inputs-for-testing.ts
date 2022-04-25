import { CliInput } from './types';

export const DUMMY_INPUT_UNDEFINED_WAS_PASSED = 'undefined was passed';
export const DUMMY_INPUT_EMPTY_ARRAY_WAS_PASSED = 'undefined was passed';
export const DUMMY_INPUT_THROWN_INTENTIONALLY = 'thrown intentionally';
export const DUMMY_INPUT_THROW = 'throw';
export const DUMMY_INPUT_THROW_NON_TRUTHY = 'throw-non-truthy';

export const dummyInput: CliInput<string, false> = {
  placeholder: '',
  getValue(argv) {
    if (typeof argv === 'undefined') {
      return DUMMY_INPUT_UNDEFINED_WAS_PASSED;
    }
    if (argv.length === 0) {
      return DUMMY_INPUT_EMPTY_ARRAY_WAS_PASSED;
    }
    if (argv[0] === DUMMY_INPUT_THROW) {
      throw new Error(DUMMY_INPUT_THROWN_INTENTIONALLY);
    }
    if (argv[0] === DUMMY_INPUT_THROW_NON_TRUTHY) {
      throw '';
    }
    return argv[0];
  },
};

export const dummyRequiredInput: CliInput<string, true> = {
  placeholder: '<foo>',
  required: true,
  getValue: dummyInput.getValue
};
