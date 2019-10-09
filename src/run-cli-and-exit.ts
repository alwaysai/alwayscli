import { CliLeaf, CliBranch } from './types';

import { USAGE } from './usage-error';
import { TERSE } from './terse-error';
import { RED_ERROR } from './constants';
import { ArgvInterface } from './argv-interface';
import { UsageString } from './usage-string';

export async function runCliAndExit(
  rootCommand: CliBranch | CliLeaf<any, any, any>,
  options: Partial<{
    argv: string[];
    processExit: (code?: number) => any;
    consoleLog: typeof console.log;
    consoleError: typeof console.error;
  }> = {},
) {
  const {
    argv = process.argv.slice(2),
    processExit = process.exit,
    consoleLog = console.log,
    consoleError = console.error,
  } = options;
  const argvInterface = ArgvInterface(rootCommand);
  let exitCode = 0;
  try {
    const result = await argvInterface(...argv);
    if (typeof result !== 'undefined') {
      consoleLog(result);
    }
  } catch (exception) {
    exitCode = 1;
    if (!exception) {
      consoleError(
        `${RED_ERROR} Encountered non-truthy exception "${exception}". Please contact the author of this command-line interface`,
      );
    } else if (exception.code === USAGE) {
      consoleError(UsageString(rootCommand, exception.message));
    } else if (exception.code === TERSE) {
      if (!exception.message) {
        consoleError(exception);
      } else {
        consoleError(`${RED_ERROR} ${exception.message}`);
      }
    } else if (typeof exception.code === 'number') {
      exitCode = exception.code;
      if (exception.message) {
        consoleError(exception.message);
      }
    } else {
      consoleError(exception);
    }
  } finally {
    processExit(exitCode);
  }
}
