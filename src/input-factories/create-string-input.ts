import { Input } from '../types';
import { UsageError } from '../usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  defaultValue: string;
}>;
const placeholder = '<str>';

export { createStringInput };
function createStringInput(
  config: Config & { defaultValue: string },
): Input<string, false>;
function createStringInput(config: Config & { required: true }): Input<string, true>;
function createStringInput(config?: Config): Input<string | undefined, false>;
function createStringInput(config: Config = {}) {
  const { defaultValue, required, description } = config;
  const input: Input<string | undefined> = {
    getValue(args) {
      if (!args) {
        return typeof defaultValue === 'string' ? defaultValue : undefined;
      }

      if (args.length > 1) {
        throw new UsageError(`Expected just one ${placeholder}`);
      }

      if (args.length === 0) {
        throw new UsageError(`Expected a ${placeholder}`);
      }

      return args[0];
    },
    getDescription() {
      return description;
    },
    placeholder,
    required,
  };
  return input;
}
