import { Leaf, AnyNamedInputs, NamedValues, AnyInput } from './types';
import { DashDashArgs } from './accumulate-dash-dash-args';

export async function accumulateNamedValues(leaf: Leaf<any>, dashDashArgs: DashDashArgs) {
  const { namedInputs } = leaf;
  let namedValues: NamedValues<AnyNamedInputs> = {};
  const restDashDashArgs = { ...dashDashArgs };
  const missingInputNames: string[] = [];
  const exceptionsRunningGetValue: { [inputName: string]: any } = {};
  if (namedInputs) {
    for (const [inputName, input] of Object.entries(namedInputs as {
      [inputName: string]: AnyInput;
    })) {
      const rawValues = restDashDashArgs[inputName];
      delete restDashDashArgs[inputName];
      if (input.required && typeof rawValues === 'undefined') {
        missingInputNames.push(inputName);
      }
      try {
        const inputValue = await (input as AnyInput).getValue(rawValues);
        namedValues[inputName] = inputValue;
      } catch (ex) {
        namedValues = {};
        exceptionsRunningGetValue[inputName] = ex;
        break;
      }
    }
  }
  const unusedInputNames = Object.keys(restDashDashArgs);
  return {
    namedValues,
    unusedInputNames,
    missingInputNames,
    exceptionsRunningGetValue,
  };
}
