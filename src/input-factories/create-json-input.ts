import parseJson = require('parse-json');

import { Input } from '../types';
import { UsageError } from '../usage-error';

const placeholder = '<json>';

// Because a JSON input value has type `any`, we don't need to do
// anything fancy with function overloads to handle the "required"
// field like we do for the string input factory

export function createJsonInput(
  config: { description?: string; required?: boolean } = {},
) {
  const input: Input<any> = {
    placeholder,
    getValue(argv) {
      if (!argv) {
        return;
      }
      if (argv.length !== 1) {
        throw new UsageError(`Expected a single ${placeholder} string`);
      }
      try {
        const parsed = parseJson(argv[0]);
        return parsed;
      } catch (ex) {
        throw new UsageError(ex.message || 'Failed to parse JSON');
      }
    },
    getDescription() {
      return config.description;
    },
  };
  return input;
}
