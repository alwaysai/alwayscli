import { UsageError } from './usage-error';

export type RawNamedArgs = {
  [optionName: string]: string[] | undefined;
};

export type AccumulatedArgv = {
  maybeCommandNames: string[];
  rawNamedArgs: RawNamedArgs;
};

export function accumulateArgv(argv: string[]) {
  const returnValue: AccumulatedArgv = {
    maybeCommandNames: [],
    rawNamedArgs: {},
  };
  let accumulator = returnValue.maybeCommandNames;
  for (const arg of argv) {
    const rawValue = arg.trim();
    const matches = rawValue.match(/^--(.*)/);
    if (matches) {
      const optionName = matches[1].trim();
      const existingOption = returnValue.rawNamedArgs[optionName];
      if (existingOption) {
        throw new UsageError(`Option "${optionName}" was provided twice`);
      } else {
        accumulator = [];
        returnValue.rawNamedArgs[optionName] = accumulator;
      }
    } else {
      accumulator.push(rawValue);
    }
  }
  return returnValue;
}
