import { Leaf, Branch } from './types';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateArgvs } from './accumulate-argvs';
import { accumulateNamedValues } from './accumulate-options-values';

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
    } = accumulateArgvs(...argv);

    const remainingCommandNameAndArgsArgv = accumulateCommandStack(
      rootCommand,
      commandNameAndArgsArgv,
    );

    if (foundHelp) {
      // e.g. cli branch0 branch1 --help
      throw new UsageError();
    }

    const lastCommand = LastCommand(rootCommand);

    if (lastCommand._type === BRANCH) {
      if (remainingCommandNameAndArgsArgv[0]) {
        // e.g. cli branch0 branch1 bad-command-name
        throw new UsageError(`Bad command "${remainingCommandNameAndArgsArgv[0]}"`);
      }
      // e.g. cli branch0 branch1
      throw new UsageError();
    }

    let argsValue: any = undefined;
    if (lastCommand.args) {
      argsValue = await callGetValue({
        input: lastCommand.args,
        argv: remainingCommandNameAndArgsArgv,
        context: '',
      });
    }

    const {
      optionsValues,
      unusedInputNames,
      missingInputNames,
      exceptionsRunningGetValue,
    } = await accumulateNamedValues(lastCommand.options, optionsArgvObject);
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

    let escapedValue: any = undefined;
    if (lastCommand.escaped) {
      escapedValue = await callGetValue({
        input: lastCommand.escaped,
        argv: escapedArgv,
        context: '--',
      });
    }

    const result = await lastCommand.action(argsValue, optionsValues, escapedValue);
    return result;
  };
}
