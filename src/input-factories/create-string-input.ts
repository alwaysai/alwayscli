import { Input } from '../types';
import { UsageError } from '../usage-error';

type Config = Partial<{
  required: boolean;
  description: string;
  defaultValue: string;
  hidden?: boolean;
  placeholder?: string;
}>;

const PLACEHOLDER = '<str>';

export { createStringInput };
function createStringInput(
  config: Config & { defaultValue: string },
): Input<string, false>;
function createStringInput(config: Config & { required: true }): Input<string, true>;
function createStringInput(config?: Config): Input<string | undefined, false>;
function createStringInput(config: Config = {}) {
  const {
    defaultValue,
    required,
    description,
    placeholder = PLACEHOLDER,
    hidden,
  } = config;
  const input: Input<string | undefined> = {
    hidden,
    placeholder,
    required,
    getValue(argv) {
      if (!argv) {
        return typeof defaultValue === 'string' ? defaultValue : undefined;
      }

      if (argv.length > 1) {
        throw new UsageError(`Expected just one ${PLACEHOLDER}`);
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected a ${PLACEHOLDER}`);
      }

      return argv[0];
    },
    getDescription() {
      return description;
    },
  };
  return input;
}
