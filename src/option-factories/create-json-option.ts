import parseJson = require('parse-json');

import { Option } from '../types';
import { FatalError } from '../fatal-error';

const placeholder = '<json>';

export function createJsonOption(
  config: { description?: string; required?: boolean } = {},
) {
  const option: Option<any> = {
    placeholder,
    getValue(argv) {
      if (!argv) {
        if (config.required) {
          throw new FatalError(`${placeholder} is required`);
        }
        return;
      }
      if (argv.length !== 1) {
        throw new FatalError(`Expected a single ${placeholder} string`);
      }
      try {
        const parsed = parseJson(argv[0]);
        return parsed;
      } catch (ex) {
        throw new FatalError(ex.message || 'Failed to parse JSON');
      }
    },
    getDescription() {
      return config.description;
    },
  };
  return option;
}
