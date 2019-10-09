import parseJson = require('parse-json');

import { CliInput } from '../types';
import { UsageError } from '../usage-error';

type Config = {
  description?: string;
  required?: boolean;
  placeholder?: string;
  hidden?: boolean;
};

// Because a JSON input value has type `any`, we don't need to do
// anything fancy with function overloads to handle the "required"
// field like we do for some other input factories.
export function createJsonInput(config: Config = {}) {
  const { placeholder = '<json>', required, description, hidden } = config;
  const input: CliInput<any> = {
    required,
    placeholder,
    hidden,
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
    description,
  };
  return input;
}
