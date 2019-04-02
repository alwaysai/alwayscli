import { Input } from '../types';
import { convertToNumber } from '../util';
import { UsageError } from '../usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  placeholder?: string;
}>;

export { createNumberArrayInput };
function createNumberArrayInput(
  config: Config & { required: true },
): Input<number[], true>;
function createNumberArrayInput(config?: Config): Input<number[] | undefined, boolean>;
function createNumberArrayInput(config: Config = {}) {
  const { required, description, placeholder = '<num0> [...]' } = config;
  const input: Input<number[] | undefined> = {
    required,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new UsageError(`Expected one or more values ${placeholder}`);
      }

      return argv.map(convertToNumber);
    },
    getDescription() {
      return description;
    },
    placeholder,
  };
  return input;
}
