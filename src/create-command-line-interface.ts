import { Leaf, Branch } from './types';

import { USAGE } from './usage-error';
import { TERSE } from './terse-error';
import { RED_ERROR } from './constants';
import { createArgvInterface } from './create-argv-interface';
import { getUsage } from './get-usage';

export function createCommandLineInterface(rootCommand: Branch | Leaf<any, any, any>) {
  const argvInterface = createArgvInterface(rootCommand);
  return async function commandLineInterface(...argv: string[]) {
    try {
      const result = await argvInterface(argv);
      return result;
    } catch (exception) {
      if (!exception) {
        throw `${RED_ERROR} Encountered non-truthy exception "${exception}". Please contact the author of this command-line interface`;
      }
      if (exception.code === USAGE) {
        throw getUsage(rootCommand, exception.message);
      }
      if (exception.code === TERSE) {
        if (!exception.message) {
          throw exception;
        }
        throw `${RED_ERROR} ${exception.message}`;
      }
      throw exception;
    }
  };
}
