import { Option } from '../types';
import { checkArgvHasValue, checkArgvLengthLessThan } from '../check-argv';
import { UsageError } from '../usage-error';

export function createJsonOption(config: { description?: string } = {}) {
  const option: Option<any | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkArgvHasValue(argv);
      checkArgvLengthLessThan(argv, 2);
      try {
        const parsed = JSON.parse(argv[0]);
        return parsed;
      } catch (ex) {
        throw new UsageError(`Failed to parse as JSON: "${argv[0]}"`);
      }
    },
    getDescription() {
      return config.description;
    },
    placeholder: '<json>',
  };
  return option;
}
