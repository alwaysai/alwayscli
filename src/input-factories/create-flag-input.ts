import { Input } from '../types';
import { UsageError } from '../usage-error';

type Config = { description?: string; hidden?: boolean };

export function createFlagInput(config: Config = {}) {
  const input: Input<boolean, false> = {
    placeholder: '',
    required: false,
    hidden: config.hidden,
    getValue(argv) {
      if (!argv) {
        return false;
      }
      if (argv.length !== 0) {
        throw new UsageError('Flag input cannot receive values');
      }
      return true;
    },
    getDescription() {
      return config.description;
    },
  };
  return input;
}
