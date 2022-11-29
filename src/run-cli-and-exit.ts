import { CliBranch, CliLeaf } from './types';

import { CliArgvInterface, CliEnhancer } from './cli-argv-interface';
import { CLI_TERSE_ERROR } from './cli-terse-error';
import { CLI_USAGE_ERROR } from './cli-usage-error';
import { RED_ERROR } from './constants';
import { UsageString } from './usage-string';

function isErrnoException(error: any): error is NodeJS.ErrnoException {
  return (
    Object.prototype.hasOwnProperty.call(error, 'code') ||
    Object.prototype.hasOwnProperty.call(error, 'errno')
  );
}

export async function runCliAndExit(
  rootCommand: CliBranch | CliLeaf<any, any, any>,
  options: Partial<{
    argv: string[];
    enhancer: CliEnhancer;
    processExit: (code?: number) => any;
    consoleLog: typeof console.log;
    consoleError: typeof console.error;
    postRun?: () => Promise<void>;
  }> = {},
) {
  const {
    argv = process.argv.slice(2),
    enhancer,
    processExit = process.exit,
    consoleLog = console.log,
    consoleError = console.error,
    postRun,
  } = options;
  const argvInterface = CliArgvInterface(rootCommand, { enhancer });
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
    } else if (isErrnoException(exception) && exception.code === CLI_USAGE_ERROR) {
      consoleError(UsageString(rootCommand, exception.message));
    } else if (isErrnoException(exception) && exception.code === CLI_TERSE_ERROR) {
      if (!exception.message) {
        consoleError(exception);
      } else {
        consoleError(`${RED_ERROR} ${exception.message}`);
      }
    } else if (isErrnoException(exception) && typeof exception.code === 'number') {
      exitCode = exception.code;
      if (exception.message) {
        consoleError(exception.message);
      }
    } else {
      consoleError(exception);
    }
  } finally {
    await postRun?.();
    processExit(exitCode);
  }
}
