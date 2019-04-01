import { Leaf, Branch, Command } from './types';
import { getUsageString } from './get-usage-string';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateDashDashArgs } from './accumulate-dash-dash-args';
import { accumulateNamedValues } from './accumulate-named-values';
import { accumulateNonHelpArgs } from './accumulate-non-help-args';

import { USAGE, UsageError } from './usage-error';
import { TERSE } from './terse-error';

export function createCli(rootCommand: Branch | Leaf<any>) {
  return async function cli(...args: string[]) {
    const { nonHelpArgs, foundHelp } = accumulateNonHelpArgs(...args);
    const { dashDashArgs, nonDashDashArgs } = accumulateDashDashArgs(...nonHelpArgs);
    const {
      commandStack: { branches, leaf },
      badCommand,
      positionalArgs,
    } = accumulateCommandStack(rootCommand, nonDashDashArgs);

    const usage = (message?: string) => {
      const commands: Command[] = [...branches];
      if (leaf) {
        commands.push(leaf);
      }
      return getUsageString(commands, message);
    };

    if (foundHelp || !leaf) {
      throw usage();
    }

    if (badCommand) {
      throw usage(`Bad command "${badCommand}"`);
    }

    if (positionalArgs.length > 0) {
      throw usage(`Command "${leaf.commandName}" does not allow positional args`);
    }

    try {
      const {
        namedValues,
        unusedInputNames,
        missingInputNames,
        exceptionsRunningGetValue,
      } = await accumulateNamedValues(leaf, dashDashArgs);
      if (unusedInputNames.length > 0) {
        const inputName = unusedInputNames[0];
        throw new UsageError(`Unknown option name "--${inputName}"`);
      }
      if (missingInputNames.length > 0) {
        const inputName = missingInputNames[0];
        throw new UsageError(`"--${inputName} is required`);
      }
      for (const [inputName, ex] of Object.entries(exceptionsRunningGetValue)) {
        if (ex && typeof ex.message === 'string') {
          ex.message = `Option "--${inputName}": ${ex.message}`;
        }
        throw ex;
      }
      const result = await leaf.action(namedValues);
      return result;
    } catch (ex) {
      if (ex.code === USAGE) {
        throw usage(ex.message);
      }
      if (ex.code === TERSE) {
        throw `Error: ${ex.message || 'No message available'}`;
      }
      throw ex;
    }
  };
}
