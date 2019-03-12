import { Option } from '../types';
import { checkArgvHasValue, checkArgvLengthLessThan } from '../check-argv';

export function createStringOption(config: { description?: string } = {}) {
  const option: Option<string | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkArgvHasValue(argv);
      checkArgvLengthLessThan(argv);
      return argv[0];
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<str>',
  };
  return option;
}
