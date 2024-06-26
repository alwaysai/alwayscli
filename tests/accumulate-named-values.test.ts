import { runAndCatch } from '@carnesen/run-and-catch';
import { accumulateNamedValues } from '../src/accumulate-named-values';
import { CLI_USAGE_ERROR } from '../src/cli-usage-error';
import {
  DUMMY_INPUT_THROW,
  dummyInput,
  dummyRequiredInput
} from '../src/dummy-inputs-for-testing';

describe(accumulateNamedValues.name, () => {
  it(`returns object of named values`, async () => {
    const namedValues = await accumulateNamedValues(
      { foo: dummyRequiredInput, baz: dummyRequiredInput },
      { foo: ['bar'], baz: ['bop'] }
    );
    expect(namedValues).toEqual({
      foo: dummyRequiredInput.getValue(['bar']),
      baz: dummyRequiredInput.getValue(['bop'])
    });
  });

  it(`re-throws error with name-specific context if getValue does`, async () => {
    const exception = await runAndCatch(
      accumulateNamedValues,
      { foo123: dummyInput },
      { foo123: [DUMMY_INPUT_THROW] }
    );
    expect(exception.message).toMatch('--foo123');
    expect(exception.message).toMatchSnapshot();
  });

  it(`throws USAGE error "Unknown argument name" with context if an unknown named argument is passed`, async () => {
    const exception = await runAndCatch(
      accumulateNamedValues,
      { foo123: dummyInput },
      { foo1234: [] }
    );
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch('--foo1234 : Unknown named argument');
  });
});
