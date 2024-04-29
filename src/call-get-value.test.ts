import { runAndCatch } from '@carnesen/run-and-catch';

import { callGetValue } from './call-get-value';
import { CLI_USAGE_ERROR } from './cli-usage-error';
import {
  dummyInput,
  dummyRequiredInput,
  DUMMY_INPUT_THROWN_INTENTIONALLY,
  DUMMY_INPUT_THROW,
  DUMMY_INPUT_THROW_NON_TRUTHY
} from './dummy-inputs-for-testing';

describe(callGetValue.name, () => {
  it(`returns getValue(argv) if an argv with length >= 1 is passed`, async () => {
    const argv = ['foo'];
    expect(await callGetValue(dummyInput, argv)).toBe(
      dummyInput.getValue(argv)
    );
    expect(await callGetValue(dummyRequiredInput, argv)).toBe(
      dummyRequiredInput.getValue(argv)
    );
  });

  it(`if not required, returns getValue(argv) if argv is an empty array or undefined`, async () => {
    expect(await callGetValue(dummyInput, [])).toBe(dummyInput.getValue([]));
    expect(await callGetValue(dummyInput, undefined)).toBe(
      dummyInput.getValue(undefined)
    );
  });

  it(`if required, throws usage error "input is required" if argv is an empty array or undefined`, async () => {
    for (const argv of [undefined, [] as string[]]) {
      const exception = await runAndCatch(
        callGetValue,
        dummyRequiredInput,
        argv
      );
      expect(exception.code).toBe(CLI_USAGE_ERROR);
      expect(exception.message).toMatch(/input is required/i);
      expect(exception.message).toMatch(dummyRequiredInput.placeholder);
    }
  });

  it(`if throws "input is required", expect message to match snapshot`, async () => {
    const exception = await runAndCatch(callGetValue, dummyRequiredInput);
    expect(exception.message).toMatchSnapshot();
  });

  it(`if throws "input is required" with context, expect message to match snapshot`, async () => {
    const exception = await runAndCatch(
      callGetValue,
      dummyRequiredInput,
      undefined,
      'context'
    );
    expect(exception.message).toMatchSnapshot();
  });

  it(`throws if getValue does with a context/placeholder enhanced message`, async () => {
    const exception = await runAndCatch(callGetValue, dummyInput, [
      DUMMY_INPUT_THROW
    ]);
    expect(exception.message).toMatch(DUMMY_INPUT_THROWN_INTENTIONALLY);
    expect(exception.message).toMatch(dummyInput.placeholder);
    expect(exception.message).toMatchSnapshot();
  });

  it(`just re-throws exception if getValue throws a non-truthy exception`, async () => {
    const exception = await runAndCatch(callGetValue, dummyInput, [
      DUMMY_INPUT_THROW_NON_TRUTHY
    ]);
    expect(exception).not.toBeTruthy();
  });
});
