import { CliInput } from './types';
import { convertToNumber } from './util';
import { CliUsageError } from './cli-usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  placeholder: string;
  hidden: boolean;
}>;

export { CliNumberArrayInput };
function CliNumberArrayInput(
  config: Config & { required: true },
): CliInput<number[], true>;
function CliNumberArrayInput(config?: Config): CliInput<number[] | undefined, boolean>;
function CliNumberArrayInput(config: Config = {}) {
  const {
    required = false,
    description,
    placeholder = '<num0> [...]',
    hidden = false,
  } = config;
  const input: CliInput<number[] | undefined> = {
    required,
    hidden,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new CliUsageError(`Expected one or more arguments ${placeholder}`);
      }

      return argv.map(convertToNumber);
    },
    description,
    placeholder,
  };
  return input;
}
