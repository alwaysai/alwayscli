import { Option } from '../types';
import { convertToNumber } from '../util';
import { FatalError } from '../fatal-error';

const placeholder = '<num0> [...]';

type Config = Partial<{
  description: string;
  required: boolean;
}>;

export { createNumberArrayOption };
function createNumberArrayOption(
  config: Config & { required: true },
): Option<number[], true>;
function createNumberArrayOption(config?: Config): Option<number[] | undefined, boolean>;
function createNumberArrayOption(config: Config = {}) {
  const { required, description } = config;
  const option: Option<number[] | undefined> = {
    required,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new FatalError(`Expected one or more values ${placeholder}`);
      }

      return argv.map(convertToNumber);
    },
    getDescription() {
      return description;
    },
    placeholder,
  };
  return option;
}
