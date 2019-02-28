import { Option } from '../types';
import { checkHasValue } from '../check-argv';
import { convertToNumber } from '../util';

export function createNumberArrayOption(config: { description?: string } = {}) {
  const option: Option<number[] | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkHasValue(argv);
      return argv.map(convertToNumber);
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<num0> [...]',
  };
  return option;
}
