import { Option } from '../types';
import { checkArgvLength1 } from '../check-argv-length-1';

export function createStringOption(config: { description?: string } = {}) {
  const option: Option<string | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkArgvLength1(argv);
      return argv[0];
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<str>',
  };
  return option;
}
