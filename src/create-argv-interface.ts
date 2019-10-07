import { Leaf, Branch } from './types';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateArgvs } from './accumulate-argvs';
import { accumulateNamedValues } from './accumulate-named-values';
import { UsageError } from './usage-error';
import { TerseError } from './terse-error';
import { BRANCH } from './constants';
import { findVersion } from './find-version';
import { callGetValue } from './call-get-value';
import { LastCommand } from './last-command';

export function createArgvInterface(rootCommand: Branch | Leaf<any, any, any>) {
  return async function argvInterface(argv: string[]) {
    if (['-v', '--version'].includes(argv[0])) {
      const version = await findVersion();
      if (!version) {
        throw new TerseError('Failed to find a "version" string');
      }
      return version;
    }

    const {
      foundHelp,
      commandNamesAndPositionalArgv,
      namedArgvs,
      escapedArgv,
    } = accumulateArgvs(argv);

    const restCommandNamesAndPositionalArgv = accumulateCommandStack(
      rootCommand,
      commandNamesAndPositionalArgv,
    );

    if (foundHelp) {
      // E.g.:
      //   cli branch0 branch1 --help
      // Same as:
      //   cli --help branch0 branch1
      throw new UsageError();
    }

    const lastCommand = LastCommand(rootCommand);

    if (lastCommand._type === BRANCH) {
      if (restCommandNamesAndPositionalArgv[0]) {
        // E.g. cli branch0 branch1 bad-command-name
        throw new UsageError(`Bad command "${restCommandNamesAndPositionalArgv[0]}"`);
      }
      // E.g. cli branch0 branch1
      throw new UsageError();
    }

    let argsValue: any = undefined;
    if (lastCommand.args) {
      // Note that for named and escaped argvs, we distinguish between
      // `undefined` and `[]`. For example, "cli" gives an escaped argv
      // `undefined` whereas "cli --" gives an escaped argv `[]`. For the
      // "positionalArgv", however, there is no such distinction. By convention,
      // we elect here to pass in `undefined` rather than an empty array when we
      // invoke `callGetValue` when `restCommandNamesAndPositionalArgv` is an
      // empty array.
      const positionalArgv =
        restCommandNamesAndPositionalArgv.length > 0
          ? restCommandNamesAndPositionalArgv
          : undefined;
      argsValue = await callGetValue(lastCommand.args, positionalArgv);
    } else if (restCommandNamesAndPositionalArgv.length > 0) {
      throw new UsageError(
        `Unexpected argument "${restCommandNamesAndPositionalArgv[0]}" : Command "${
          lastCommand.name
        }" does not accept positional arguments`,
      );
    }

    const namedValues = await accumulateNamedValues(
      lastCommand.options || {},
      namedArgvs,
    );

    let escapedValue: any = undefined;
    if (lastCommand.escaped) {
      escapedValue = await callGetValue(lastCommand.escaped, escapedArgv, '--');
    } else if (escapedArgv) {
      throw new UsageError(
        `Command "${lastCommand.name}" does not allow "--" as an argument`,
      );
    }

    const result = await lastCommand.action(argsValue, namedValues, escapedValue);
    return result;
  };
}
