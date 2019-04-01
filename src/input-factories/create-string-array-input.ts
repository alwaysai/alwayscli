import { Input } from '../types';
import { UsageError } from '../usage-error';

const placeholder = '<str0> [...]';

type Config = Partial<{
  description: string;
  required: boolean;
}>;

export { createStringArrayInput };
function createStringArrayInput(
  config: Config & { required: true },
): Input<string[], true>;
function createStringArrayInput(config?: Config): Input<string[] | undefined, boolean>;
function createStringArrayInput(config: Config = {}) {
  const { required, description } = config;
  const input: Input<string[] | undefined> = {
    required,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected one or more values ${placeholder}`);
      }

      return argv;
    },
    getDescription() {
      return description;
    },
    placeholder,
  };
  return input;
}
