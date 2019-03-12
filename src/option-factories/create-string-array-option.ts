import { Option } from '../types';
import { checkArgvHasValue } from '../check-argv';

export function createStringArrayOption(config: { description?: string } = {}) {
  const option: Option<string[] | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkArgvHasValue(argv);
      return argv;
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<str0> [...]',
  };
  return option;
}
