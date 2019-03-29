import { Option } from '../types';
import { FatalError } from '../fatal-error';

export function createFlagOption(config: { description?: string } = {}) {
  const option: Option<boolean, false> = {
    getValue(argv) {
      if (!argv) {
        return false;
      }
      if (argv.length !== 0) {
        throw new FatalError('Flag option cannot receive values');
      }
      return true;
    },
    getDescription() {
      return config.description;
    },
    placeholder: '',
    required: false,
  };
  return option;
}
