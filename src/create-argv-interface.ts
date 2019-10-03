import { Leaf, Branch } from './types';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateArgvObject } from './accumulate-argv-object';
import { accumulateOptionsValues } from './accumulate-options-values';

import { UsageError } from './usage-error';
import { TerseError } from './terse-error';
import { BRANCH } from './constants';
import { findVersion } from './find-version';
import { callGetValue } from './call-get-value';
import { LastCommand } from './last-command';

export function createArgvInterface(rootCommand: Branch | Leaf<any, any, any>) {
  return async function argvInterface(...argv: string[]) {
    if (['-v', '--version'].includes(argv[0])) {
      if (rootCommand.version) {
        return rootCommand.version;
      }
      const foundVersion = await findVersion();
      if (foundVersion) {
        return foundVersion;
      }
      throw new TerseError('Failed to find a CLI version string');
    }
    const {
      foundHelp,
      commandNameAndArgsArgv,
      optionsArgvObject,
      escapedArgv,
    } = accumulateArgvObject(...argv);
    const argsArgv = accumulateCommandStack(rootCommand, commandNameAndArgsArgv);

    if (foundHelp) {
      throw new UsageError();
    }

    const lastCommand = LastCommand(rootCommand);

    if (lastCommand._type === BRANCH) {
      if (argsArgv[0]) {
        throw new UsageError(`Bad command "${argsArgv[0]}"`);
      }
      throw new UsageError();
    }

    const { value: argsValue, errorMessage: argsErrorMessage } = await callGetValue(
      lastCommand.args,
      argsArgv,
    );
    if (argsErrorMessage) {
      throw new UsageError(argsErrorMessage);
    }

    const {
      optionsValues,
      unusedInputNames,
      missingInputNames,
      exceptionsRunningGetValue,
    } = await accumulateOptionsValues(lastCommand, optionsArgvObject);
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

    const { value: escapedValue, errorMessage: escapedErrorMessage } = await callGetValue(
      lastCommand.escaped,
      escapedArgv,
    );

    if (escapedErrorMessage) {
      throw new UsageError(escapedErrorMessage);
    }

    const result = await lastCommand.action(argsValue, optionsValues, escapedValue);
    return result;
  };
}
