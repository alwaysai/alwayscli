import { CliInput } from '../types';
import { convertToNumber } from '../util';
import { UsageError } from '../usage-error';

type Value = number;

type Config = Partial<{
  required: boolean;
  description: string;
  defaultValue: Value;
  placeholder?: string;
  hidden?: boolean;
}>;

export { createNumberInput };
function createNumberInput(
  config: Config & { defaultValue: Value },
): CliInput<number, false>;
function createNumberInput(config: Config & { required: true }): CliInput<Value, true>;
function createNumberInput(config?: Config): CliInput<Value | undefined, boolean>;
function createNumberInput(config: Config = {}) {
  const { required, description, defaultValue, placeholder = '<num>', hidden } = config;
  const input: CliInput<Value | undefined> = {
    required,
    hidden,
    getValue(argv) {
      if (!argv) {
        return typeof defaultValue === 'number' ? defaultValue : undefined;
      }

      if (argv.length > 1) {
        throw new UsageError(`Expected just one ${placeholder}`);
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected a ${placeholder}`);
      }

      return convertToNumber(argv[0]);
    },
    description,
    placeholder,
  };
  return input;
}
