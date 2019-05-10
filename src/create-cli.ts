import { Leaf, Branch, Command } from './types';
import { getUsage } from './get-usage';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateDashDashArgs } from './accumulate-dash-dash-args';
import { accumulateOptionsValues } from './accumulate-named-values';
import { accumulateNonHelpArgv } from './accumulate-non-help-argv';

import { USAGE, UsageError } from './usage-error';
import { TERSE } from './terse-error';
import { accumulateArgsValue } from './accumulate-args-value';
import readPkgUp = require('read-pkg-up');
import { RED_ERROR } from './constants';
import { dirname } from 'path';

export function createCli(rootCommand: Branch | Leaf<any, any>) {
  return async function cli(...args: string[]) {
    if (['-v', '--version'].includes(args[0])) {
      if (rootCommand.version) {
        return rootCommand.version;
      }
      // An explicit version was not provided with root command.
      // Let's try to find a version string in a package.json
      const mainModule = require.main;
      if (mainModule) {
        const pkg =
          readPkgUp.sync({
            cwd: dirname(mainModule.filename),
            normalize: false,
          }).pkg || {};

        if (pkg.version) {
          return pkg.version;
        }
      }
      throw `${RED_ERROR} Failed to find a CLI "version"`;
    }
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

    if (foundHelp) {
      throw usage();
    }

    if (badCommand) {
      throw usage(`Bad command "${badCommand}"`);
    }

    if (!leaf) {
      throw usage();
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
      if (!ex) {
        throw ex;
      }
      if (ex.code === USAGE) {
        throw usage(ex.message);
      }
      if (ex.code === TERSE) {
        throw `${RED_ERROR} ${ex.message || 'No message available'}`;
      }
      throw ex;
    }
  };
}
