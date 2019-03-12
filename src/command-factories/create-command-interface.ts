import { Leaf, Branch, AnyOptions, NamedArgs, AnyOption } from '../types';
import { accumulateArgv } from '../accumulate-argv';
import { accumulateCommandStack } from '../accumulate-command-stack';
import { getUsageString } from '../get-usage-string';
import { LEAF } from '../constants';
import { UsageError, USAGE } from '../usage-error';
import { FATAL } from '../fatal-error';

export function createCommandInterface(rootCommand: Branch | Leaf<any>) {
  return async function commandInterface(argv: string[]) {
    const commandStack = [rootCommand];
    try {
      const { maybeCommandNames, rawNamedArgs } = accumulateArgv(argv);
      let foundHelp = false;
      let slicedCommandNames = maybeCommandNames;
      for (const h of ['help', '-h', 'h']) {
        const indexOfH = maybeCommandNames.indexOf(h);
        if (indexOfH > -1) {
          foundHelp = true;
          slicedCommandNames = slicedCommandNames.slice(0, indexOfH);
        }
      }
      if (rawNamedArgs['help']) {
        foundHelp = true;
      }
      accumulateCommandStack(commandStack, slicedCommandNames);
      // ^^ This mutates commandStack

      const command = commandStack.slice(-1)[0];
      if (foundHelp || command.commandType !== LEAF) {
        throw getUsageString(commandStack);
      }

      const { action, options } = command;
      const namedArgs: NamedArgs<AnyOptions> = {};
      const restRawNamedArgs = { ...rawNamedArgs };
      if (options) {
        for (const [optionName, option] of Object.entries(options)) {
          const rawValues = restRawNamedArgs[optionName];
          delete restRawNamedArgs[optionName];
          try {
            const optionValue = await (option as AnyOption).getValue(rawValues);
            namedArgs[optionName] = optionValue;
          } catch (ex) {
            if (ex.code === 'USAGE') {
              ex.message = `--${optionName}: ${ex.message}`;
              throw ex;
            }
          }
        }
      }
      const restOptionNames = Object.keys(restRawNamedArgs);
      if (restOptionNames.length > 0) {
        throw new UsageError(`Unknown option "--${restOptionNames[0]}"`);
      }
      const result = await action(namedArgs);
      return result;
    } catch (ex) {
      if (ex.code === USAGE) {
        throw getUsageString(commandStack, ex.message);
      }
      if (ex.code === FATAL) {
        throw `Error: ${ex.message || 'No message available'}`;
      }
      throw ex;
    }
  };
}
