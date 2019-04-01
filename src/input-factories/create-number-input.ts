import { Input } from '../types';
import { convertToNumber } from '../util';
import { UsageError } from '../usage-error';

const placeholder = '<num0> [...]';
type Value = number;

type Config = Partial<{
  required: boolean;
  description: string;
  defaultValue: Value;
}>;

export { createNumberInput };
function createNumberInput(
  config: Config & { defaultValue: Value },
): Input<number, false>;
function createNumberInput(config: Config & { required: true }): Input<Value, true>;
function createNumberInput(config?: Config): Input<Value | undefined, boolean>;
function createNumberInput(config: Config = {}) {
  const { required, description, defaultValue } = config;
  const input: Input<Value | undefined> = {
    required,
    getValue(args) {
      if (!args) {
        return typeof defaultValue === 'number' ? defaultValue : undefined;
      }

      if (args.length > 1) {
        throw new UsageError(`Expected just one ${placeholder}`);
      }

      if (args.length === 0) {
        throw new UsageError(`Expected a ${placeholder}`);
      }

      return convertToNumber(args[0]);
    },
    getDescription() {
      return description;
    },
    placeholder,
  };
  return input;
}
