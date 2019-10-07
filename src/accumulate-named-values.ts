import { AnyNamedInputs, NamedValues } from './types';
import { NamedArgvs } from './accumulate-argvs';
import { callGetValue } from './call-get-value';
import { UsageError } from './usage-error';

export async function accumulateNamedValues(
  namedInputs: AnyNamedInputs,
  namedArgvs: NamedArgvs,
) {
  const namedValues: NamedValues<AnyNamedInputs> = {};
  const restNamedArgvs = { ...namedArgvs };
  const asyncFuncs: (() => Promise<void>)[] = [];
  for (const [name, input] of Object.entries(namedInputs)) {
    const argv = restNamedArgvs[name];
    delete restNamedArgvs[name];
    asyncFuncs.push(async () => {
      const value = await callGetValue(input, argv, `--${name}`);
      namedValues[name] = value;
    });
  }
  const restNames = Object.keys(restNamedArgvs);
  if (restNames[0]) {
    throw new UsageError(`--${restNames[0]} : Unknown named argument`);
  }
  await Promise.all(asyncFuncs.map(asyncFunc => asyncFunc()));
  return namedValues;
}
