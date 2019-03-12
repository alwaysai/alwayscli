import { Option } from '../types';
import { checkArgvHasValue } from '../check-argv';
import { convertToNumber } from '../util';

export function createNumberArrayOption(config: { description?: string } = {}) {
  const option: Option<number[] | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkArgvHasValue(argv);
      return argv.map(convertToNumber);
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<num0> [...]',
  };
  return option;
}
