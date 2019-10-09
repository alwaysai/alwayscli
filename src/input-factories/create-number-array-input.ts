import { CliInput } from '../types';
import { convertToNumber } from '../util';
import { UsageError } from '../usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  placeholder?: string;
  hidden?: boolean;
}>;

export { createNumberArrayInput };
function createNumberArrayInput(
  config: Config & { required: true },
): CliInput<number[], true>;
function createNumberArrayInput(config?: Config): CliInput<number[] | undefined, boolean>;
function createNumberArrayInput(config: Config = {}) {
  const { required, description, placeholder = '<num0> [...]', hidden } = config;
  const input: CliInput<number[] | undefined> = {
    required,
    hidden,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected one or more values ${placeholder}`);
      }

      return argv.map(convertToNumber);
    },
    description,
    placeholder,
  };
  return input;
}
