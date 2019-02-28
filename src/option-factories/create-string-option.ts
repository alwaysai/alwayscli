import { Option } from '../types';
import { checkHasValue, checkNotTooManyValues } from '../check-argv';

export function createStringOption(config: { description?: string } = {}) {
  const option: Option<string | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkHasValue(argv);
      checkNotTooManyValues(argv);
      return argv[0];
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<str>',
  };
  return option;
}
