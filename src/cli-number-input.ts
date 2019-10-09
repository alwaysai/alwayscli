import { CliInput } from './types';
import { convertToNumber } from './util';
import { CliUsageError } from './cli-usage-error';

type Config = Partial<{
  required: boolean;
  description: string;
  defaultValue: number;
  placeholder: string;
  hidden: boolean;
}>;

export { CliNumberInput };
function CliNumberInput(
  config: Config & { defaultValue: number },
): CliInput<number, false>;
function CliNumberInput(config: Config & { required: true }): CliInput<number, true>;
function CliNumberInput(config?: Config): CliInput<number | undefined, boolean>;
function CliNumberInput(config: Config = {}) {
  const {
    required = false,
    description,
    defaultValue,
    placeholder = '<num>',
    hidden = false,
  } = config;
  const input: CliInput<number | undefined> = {
    required,
    hidden,
    getValue(argv) {
      if (!argv) {
        return typeof defaultValue === 'number' ? defaultValue : undefined;
      }

      if (argv.length > 1) {
        throw new CliUsageError(`Expected just one ${placeholder}`);
      }

      if (argv.length === 0) {
        throw new CliUsageError(`Expected a ${placeholder}`);
      }

      return convertToNumber(argv[0]);
    },
    description,
    placeholder,
  };
  return input;
}
