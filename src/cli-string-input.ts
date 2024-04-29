import { CliInput } from './types';
import { CliUsageError } from './cli-usage-error';

type Config = Partial<{
  required: boolean;
  description: string;
  defaultValue: string;
  hidden?: boolean;
  placeholder?: string;
}>;

export { CliStringInput };
function CliStringInput(
  config: Config & { defaultValue: string }
): CliInput<string, false>;
function CliStringInput(
  config: Config & { required: true }
): CliInput<string, true>;
function CliStringInput(config?: Config): CliInput<string | undefined, false>;
function CliStringInput(config: Config = {}) {
  const {
    defaultValue,
    required = false,
    description,
    placeholder = '<str>',
    hidden = false
  } = config;
  const input: CliInput<string | undefined> = {
    hidden,
    placeholder,
    required,
    getValue(argv) {
      if (!argv) {
        return typeof defaultValue === 'string' ? defaultValue : undefined;
      }

      if (argv.length > 1) {
        throw new CliUsageError(`Expected just one ${placeholder}`);
      }

      if (argv.length === 0) {
        throw new CliUsageError(`Expected a ${placeholder}`);
      }

      return argv[0];
    },
    description
  };
  return input;
}
