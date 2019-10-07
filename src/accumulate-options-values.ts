import { AnyNamedInputs, NamedValues, AnyInput } from './types';
import { NamedArgvs } from './accumulate-argvs';

export async function accumulateNamedValues(
  options: AnyNamedInputs,
  namedArgvs: NamedArgvs,
) {
  const namedValues: NamedValues<AnyNamedInputs> = {};
  const remainingNamedArgvs = { ...namedArgvs };
  const missingNames: string[] = [];
  for (const [name, input] of Object.entries(options)) {
    const rawValues = remainingNamedArgvs[name];
    delete remainingNamedArgvs[name];
    if (input.required && typeof rawValues === 'undefined') {
      missingNames.push(name);
    }
    const inputValue = await (input as AnyInput).getValue(rawValues);
    namedValues[name] = inputValue;
  }
  const unusedInputNames = Object.keys(remainingNamedArgvs);
  return {
    optionsValues: namedValues,
    unusedInputNames,
    missingInputNames: missingNames,
  };
}
