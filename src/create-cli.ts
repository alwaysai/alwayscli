import { Leaf, Branch, Command } from './types';
import { getUsage } from './get-usage';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateArgvObject } from './accumulate-argv-object';
import { accumulateOptionsValues } from './accumulate-options-values';

import { USAGE, UsageError } from './usage-error';
import { TERSE, TerseError } from './terse-error';
import { RED_ERROR } from './constants';
import { findVersion } from './find-version';
import { callGetValue } from './call-get-value';

export function createCli(rootCommand: Branch | Leaf<any, any, any>) {
  return async function cli(...argv: string[]) {
    if (['-v', '--version'].includes(argv[0])) {
      if (rootCommand.version) {
        return rootCommand.version;
      }
      const foundVersion = await findVersion();
      if (foundVersion) {
        return foundVersion;
      }
      throw `${RED_ERROR} Failed to find a CLI "version"`;
    }
    const {
      foundHelp,
      commandNameAndArgsArgv,
      optionsArgvObject,
      escapedArgv,
    } = accumulateArgvObject(...argv);
    const {
      commandStack: { branches, leaf },
      badCommandName,
      argsArgv,
    } = accumulateCommandStack(rootCommand, commandNameAndArgsArgv);

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

    if (badCommandName) {
      throw usage(`Bad command "${badCommandName}"`);
    }

    if (!leaf) {
      throw usage();
    }

    try {
      const { value: argsValue, errorMessage: argsErrorMessage } = await callGetValue(
        leaf.args,
        argsArgv,
      );
      if (argsErrorMessage) {
        throw usage(argsErrorMessage);
      }

      const {
        optionsValues,
        unusedInputNames,
        missingInputNames,
        exceptionsRunningGetValue,
      } = await accumulateOptionsValues(leaf, optionsArgvObject);
      if (exceptionsRunningGetValue.length > 0) {
        const [inputName, ex] = exceptionsRunningGetValue[0];
        const message =
          ex && typeof ex.message === 'string'
            ? ex.message
            : 'Problem getting option value';
        throw new TerseError(`"--${inputName}": ${message}`);
      }

      if (unusedInputNames.length > 0) {
        const inputName = unusedInputNames[0];
        throw new UsageError(`Unknown option name "--${inputName}"`);
      }
      if (missingInputNames.length > 0) {
        const inputName = missingInputNames[0];
        throw new UsageError(`"--${inputName}" is required`);
      }

      const {
        value: escapedValue,
        errorMessage: escapedErrorMessage,
      } = await callGetValue(leaf.escaped, escapedArgv);

      if (escapedErrorMessage) {
        throw usage(escapedErrorMessage);
      }

      const result = await leaf.action(argsValue, optionsValues, escapedValue);
      return result;
    } catch (ex) {
      if (!ex) {
        throw `${RED_ERROR} Encountered non-truthy exception "${ex}". Please contact the author of ${
          require.main!.filename
        }`;
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
