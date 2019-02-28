import { Option } from '../types';
import { checkHasValue } from '../check-argv';

export function createStringArrayOption(config: { description?: string } = {}) {
  const option: Option<string[] | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkHasValue(argv);
      return argv;
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<str0> [...]',
  };
  return option;
}
