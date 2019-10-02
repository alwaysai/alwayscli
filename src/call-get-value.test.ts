import { Input } from './types';
import { callGetValue } from './call-get-value';

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

describe(callGetValue.name, () => {
  it(`returns the return value of ${
    input.getValue.name
  } if an argv with length >= 1 is passed`, async () => {
    const result = await callGetValue(input, ['foo']);
    expect(result.value).toBe('foo');
  });

  it(`returns getValue(undefined) if an empty array is passed as argv`, async () => {
    const result = await callGetValue(input, []);
    expect(result.value).toBe(UNDEFINED_WAS_PASSED);
  });

  it(`returns getValue(undefined) if undefined is passed as argv`, async () => {
    const result = await callGetValue(input, undefined);
    expect(result.value).toBe(UNDEFINED_WAS_PASSED);
  });

  it(`returns value undefined if input and argv are undefined`, async () => {
    const result = await callGetValue(undefined, undefined);
    expect(result.value).toEqual(undefined);
  });

  it(`returns value undefined if input is undefined and argv is an empty string`, async () => {
    const result = await callGetValue(undefined, []);
    expect(result.value).toEqual(undefined);
  });

  it(`returns value undefined if input is undefined and argv is an empty string`, async () => {
    const result = await callGetValue(undefined, []);
    expect(result.value).toEqual(undefined);
  });

  it(`returns error message referencing the unexpected argument if input is undefined but argv has an item`, async () => {
    const result = await callGetValue(undefined, ['foo']);
    expect(result.errorMessage).toMatch(/unexpected argument/i);
    expect(result.errorMessage).toMatch('foo');
  });

  it(`returns error message if input is "required" but argv is empty`, async () => {
    const result = await callGetValue(requiredInput, []);
    expect(result.errorMessage).toMatch(/required/i);
    expect(result.errorMessage).toMatch(requiredInput.placeholder);
  });
});
