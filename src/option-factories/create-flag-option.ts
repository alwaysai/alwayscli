import { Option } from '../types';
import { checkArgvLengthLessThan } from '../check-argv';

export function createFlagOption(config: { description?: string } = {}) {
  const option: Option<boolean> = {
    getValue(argv) {
      if (!argv) {
        return false;
      }
      checkArgvLengthLessThan(argv, 1);
      return true;
    },
    getDescription() {
      return config.description;
    },
    placeholder: '',
  };
  return option;
}
