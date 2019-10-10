import { AnyCommand } from './types';
import { accumulateCommandStack } from './accumulate-command-stack';
import { accumulateArgvs } from './accumulate-argvs';
import { accumulateNamedValues } from './accumulate-named-values';
import { CliUsageError } from './cli-usage-error';
import { CliTerseError } from './cli-terse-error';
import { CLI_BRANCH } from './constants';
import { findVersion } from './find-version';
import { callGetValue } from './call-get-value';
import { LastCommand } from './last-command';

type ArgvInterface = (...argv: string[]) => Promise<any>;

export type CliEnhancer = (argvInterface: ArgvInterface) => ArgvInterface;

export function CliArgvInterface(
  rootCommand: AnyCommand,
  options: Partial<{ enhancer: CliEnhancer }> = {},
) {
  const { enhancer } = options;

  if (enhancer) {
    return enhancer(argvInterface);
  }

  return argvInterface;

  async function argvInterface(...argv: string[]) {
    if (['-v', '--version'].includes(argv[0])) {
      const version = await findVersion();
      if (!version) {
        throw new CliTerseError('Failed to find a "version" string');
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
      throw new CliUsageError();
    }

    const lastCommand = LastCommand(rootCommand);

    if (lastCommand.commandType === CLI_BRANCH) {
      if (restCommandNamesAndPositionalArgv[0]) {
        // E.g. cli branch0 branch1 bad-command-name
        throw new CliUsageError(`Bad command "${restCommandNamesAndPositionalArgv[0]}"`);
      }
      // E.g. cli branch0 branch1
      throw new CliUsageError();
    }

    let argsValue: any = undefined;
    if (lastCommand.positionalInput) {
      // Note that for named and escaped argvs, we distinguish between
      // `undefined` and `[]`. For example, "cli" gives an escaped argv
      // `undefined` whereas "cli --" gives an escaped argv `[]`. For the
      // "positionalArgv", however, there is no such distinction. By convention,
      // we elect here to pass in `undefined` rather than an empty array when no
      // positional arguments are passed.
      const positionalArgv =
        restCommandNamesAndPositionalArgv.length > 0
          ? restCommandNamesAndPositionalArgv
          : undefined;
      argsValue = await callGetValue(lastCommand.positionalInput, positionalArgv);
    } else if (restCommandNamesAndPositionalArgv.length > 0) {
      throw new CliUsageError(
        `Unexpected argument "${restCommandNamesAndPositionalArgv[0]}" : Command "${
          lastCommand.name
        }" does not accept positional arguments`,
      );
    }

    const namedValues = await accumulateNamedValues(
      lastCommand.namedInputs || {},
      namedArgvs,
    );

    let escapedValue: any = undefined;
    if (lastCommand.escapedInput) {
      escapedValue = await callGetValue(lastCommand.escapedInput, escapedArgv, '--');
    } else if (escapedArgv) {
      throw new CliUsageError(
        `Command "${lastCommand.name}" does not allow "--" as an argument`,
      );
    }

    const result = await lastCommand.action(argsValue, namedValues, escapedValue);
    return result;
  }
}
