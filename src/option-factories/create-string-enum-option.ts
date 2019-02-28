import { Option } from '../types';
import { checkHasValue, checkNotTooManyValues } from '../check-argv';
import { UsageError } from '../usage-error';
import { singleQuote, regularizeDescription } from '../util';

export function createStringEnumOption<U extends string[]>(config: {
  allowedValues: U;
  description?: string;
}) {
  if (config.allowedValues) {
  }
  const option: Option<U[number] | undefined> = {
    getValue(argv) {
      if (!argv) {
        return;
      }
      checkHasValue(argv);
      checkNotTooManyValues(argv);
      if (!config.allowedValues.includes(argv[0])) {
        throw new UsageError(``);
      }
      return argv[0] as U[number];
    },
    getDescription() {
      let description = config.description
        ? regularizeDescription(config.description)
        : '';
      description += `Allowed values {${config.allowedValues
        .map(singleQuote)
        .join(', ')}}`;
      return description;
    },
    placeholder: '<str>',
  };
  return option;
}
