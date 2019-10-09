import { CliInput } from '../types';
import { UsageError } from '../usage-error';

type Config = { description?: string; hidden?: boolean };

export function CliFlagInput(config: Config = {}) {
  const { description, hidden } = config;
  const input: CliInput<boolean, false> = {
    placeholder: '',
    required: false,
    hidden,
    getValue(argv) {
      if (!argv) {
        return false;
      }
      if (argv.length !== 0) {
        throw new UsageError('Flag input cannot receive values');
      }
      return true;
    },
    description,
  };
  return input;
}
