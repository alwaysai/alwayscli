import { Input } from './types';
import { callGetValue } from './call-get-value';
import { runAndCatch } from '@carnesen/run-and-catch';
import { USAGE } from './usage-error';

const UNDEFINED_WAS_PASSED = 'undefined was passed';
const EMPTY_ARRAY_WAS_PASSED = 'undefined was passed';
const THROWN_INTENTIONALLY = 'thrown intentionally';

const input: Input<string, false> = {
  placeholder: '',
  getValue(argv) {
    if (typeof argv === 'undefined') {
      return UNDEFINED_WAS_PASSED;
    }
    if (argv.length === 0) {
      return EMPTY_ARRAY_WAS_PASSED;
    }
    if (argv[0] === 'throw') {
      throw new Error(THROWN_INTENTIONALLY);
    }
    if (argv[0] === 'throw-non-truthy') {
      throw '';
    }
    return argv[0];
  },
  getDescription: () => '',
};

const requiredInput: Input<string, true> = {
  placeholder: '<foo>',
  required: true,
  getValue: input.getValue,
  getDescription: () => '',
};

describe(callGetValue.name, () => {
  it(`returns getValue(argv) if an argv with length >= 1 is passed`, async () => {
    const argv = ['foo'];
    expect(await callGetValue({ input, argv })).toBe(input.getValue(argv));
    expect(await callGetValue({ input: requiredInput, argv })).toBe(
      requiredInput.getValue(argv),
    );
  });

  it(`if not required, returns getValue(argv) if argv is an empty array or undefined`, async () => {
    expect(await callGetValue({ input, argv: [] })).toBe(input.getValue([]));
    expect(await callGetValue({ input, argv: undefined })).toBe(
      input.getValue(undefined),
    );
  });

  it(`if required, throws usage error "input is required" if argv is an empty array or undefined`, async () => {
    for (const argv of [undefined, [] as string[]]) {
      const exception = await runAndCatch(callGetValue, { input: requiredInput, argv });
      expect(exception.code).toBe(USAGE);
      expect(exception.message).toMatch(/input is required/i);
      expect(exception.message).toMatch(requiredInput.placeholder);
    }
  });

  it(`if throws "input is required", expect message to match snapshot`, async () => {
    const exception = await runAndCatch(callGetValue, { input: requiredInput });
    expect(exception.message).toMatchSnapshot();
  });

  it(`if throws "input is required" with context, expect message to match snapshot`, async () => {
    const exception = await runAndCatch(callGetValue, {
      input: requiredInput,
      context: 'context',
    });
    expect(exception.message).toMatchSnapshot();
  });

  it(`throws if getValue does with a context/placeholder enhanced message`, async () => {
    const exception = await runAndCatch(callGetValue, {
      input,
      argv: ['throw'],
    });
    expect(exception.message).toMatch(THROWN_INTENTIONALLY);
    expect(exception.message).toMatch(input.placeholder);
    expect(exception.message).toMatchSnapshot();
  });

  it(`just re-throws exception if getValue throws a non-truthy exception`, async () => {
    const exception = await runAndCatch(callGetValue, {
      input,
      argv: ['throw-non-truthy'],
    });
    expect(exception).toBe('');
  });
});
