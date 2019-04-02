import { Leaf, AnyOptions, NamedValues, AnyInput } from './types';
import { DashDashArgs } from './accumulate-dash-dash-args';

export async function accumulateOptionsValues(
  leaf: Leaf<any, any>,
  dashDashArgs: DashDashArgs,
) {
  const { options } = leaf;
  let optionsValues: NamedValues<AnyOptions> = {};
  const restDashDashArgs = { ...dashDashArgs };
  const missingInputNames: string[] = [];
  const exceptionsRunningGetValue: { [inputName: string]: any } = {};
  if (options) {
    for (const [inputName, input] of Object.entries(options as {
      [inputName: string]: AnyInput;
    })) {
      const rawValues = restDashDashArgs[inputName];
      delete restDashDashArgs[inputName];
      if (input.required && typeof rawValues === 'undefined') {
        missingInputNames.push(inputName);
      }
      try {
        const inputValue = await (input as AnyInput).getValue(rawValues);
        optionsValues[inputName] = inputValue;
      } catch (ex) {
        optionsValues = {};
        exceptionsRunningGetValue[inputName] = ex;
        break;
      }
    }
  }
  const unusedInputNames = Object.keys(restDashDashArgs);
  return {
    optionsValues,
    unusedInputNames,
    missingInputNames,
    exceptionsRunningGetValue,
  };
}
