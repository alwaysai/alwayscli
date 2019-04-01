import { Input } from '../types';
import { UsageError } from '../usage-error';

export function createFlagInput(config: { description?: string } = {}) {
  const input: Input<boolean, false> = {
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
    placeholder: '',
    required: false,
  };
  return input;
}
