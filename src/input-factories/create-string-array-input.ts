import { Input } from '../types';
import { UsageError } from '../usage-error';

const PLACEHOLDER = '<str0> [...]';

type Config = Partial<{
  description: string;
  required: boolean;
  hidden?: boolean;
  placeholder?: string;
}>;

export { createStringArrayInput };
function createStringArrayInput(
  config: Config & { required: true },
): Input<string[], true>;
function createStringArrayInput(config?: Config): Input<string[] | undefined, boolean>;
function createStringArrayInput(config: Config = {}) {
  const { required, description, placeholder = PLACEHOLDER, hidden } = config;
  const input: Input<string[] | undefined> = {
    required,
    hidden,
    placeholder,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected one or more values ${PLACEHOLDER}`);
      }

      return argv;
    },
    getDescription() {
      return description;
    },
  };
  return input;
}
