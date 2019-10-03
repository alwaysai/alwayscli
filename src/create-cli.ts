import { Leaf, Branch } from './types';

import { USAGE } from './usage-error';
import { TERSE } from './terse-error';
import { RED_ERROR } from './constants';
import { createArgvInterface } from './create-argv-interface';
import { getUsage } from './get-usage';

export function createCli(rootCommand: Branch | Leaf<any, any, any>) {
  const argvInterface = createArgvInterface(rootCommand);
  return async function cli(...argv: string[]) {
    try {
      const result = await argvInterface(...argv);
      return result;
    } catch (ex) {
      if (!ex) {
        throw `${RED_ERROR} Encountered non-truthy exception "${ex}". Please contact the author of ${
          require.main!.filename
        }`;
      }
      if (ex.code === USAGE) {
        throw getUsage(rootCommand, ex.message);
      }
      if (ex.code === TERSE) {
        throw `${RED_ERROR} ${ex.message || 'No message available'}`;
      }
      throw ex;
    }
  };
}
