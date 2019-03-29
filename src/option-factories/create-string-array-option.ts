import { Option } from '../types';
import { FatalError } from '../fatal-error';

const placeholder = '<str0> [...]';

type Config = Partial<{
  description: string;
  required: boolean;
}>;

export { createStringArrayOption };
function createStringArrayOption(
  config: Config & { required: true },
): Option<string[], true>;
function createStringArrayOption(config?: Config): Option<string[] | undefined, boolean>;
function createStringArrayOption(config: Config = {}) {
  const { required, description } = config;
  const option: Option<string[] | undefined> = {
    required,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new FatalError(`Expected one or more values ${placeholder}`);
      }

      return argv;
    },
    getDescription() {
      return description;
    },
    placeholder,
  };
  return option;
}
