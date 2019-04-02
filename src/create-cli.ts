import { Leaf, Branch, Command } from './types';
import { getUsage } from './get-usage';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateDashDashArgs } from './accumulate-dash-dash-args';
import { accumulateOptionsValues } from './accumulate-named-values';
import { accumulateNonHelpArgv } from './accumulate-non-help-argv';

import { USAGE, UsageError } from './usage-error';
import { TERSE } from './terse-error';
import { accumulateArgsValue } from './accumulate-args-value';

export function createCli(rootCommand: Branch | Leaf<any, any>) {
  return async function cli(...args: string[]) {
    const { nonHelpArgv: nonHelpArgs, foundHelp } = accumulateNonHelpArgv(...args);
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
      return getUsage(commands, message);
    };

    if (foundHelp || !leaf) {
      throw usage();
    }

    if (badCommand) {
      throw usage(`Bad command "${badCommand}"`);
    }

    try {
      const { argsValue, errorMessage } = await accumulateArgsValue(leaf, positionalArgs);
      if (errorMessage) {
        throw usage(errorMessage);
      }
      const {
        optionsValues,
        unusedInputNames,
        missingInputNames,
        exceptionsRunningGetValue,
      } = await accumulateOptionsValues(leaf, dashDashArgs);
      if (unusedInputNames.length > 0) {
        const inputName = unusedInputNames[0];
        throw new UsageError(`Unknown option name "--${inputName}"`);
      }
      if (missingInputNames.length > 0) {
        const inputName = missingInputNames[0];
        throw new UsageError(`"--${inputName}" is required`);
      }
      for (const [inputName, ex] of Object.entries(exceptionsRunningGetValue)) {
        if (ex && typeof ex.message === 'string') {
          ex.message = ` "--${inputName}": ${ex.message ||
            'Problem getting option value'}`;
        }
        throw ex;
      }
      const result = await leaf.action(argsValue, optionsValues);
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
