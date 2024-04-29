import { CliInput } from './types';
import { CliUsageError } from './cli-usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  hidden: boolean;
  placeholder: string;
}>;

export { CliStringArrayInput };
function CliStringArrayInput(
  config: Config & { required: true }
): CliInput<string[], true>;
function CliStringArrayInput(
  config?: Config
): CliInput<string[] | undefined, boolean>;
function CliStringArrayInput(config: Config = {}) {
  const {
    required = false,
    description,
    placeholder = '<str0> [...]',
    hidden = false
  } = config;
  const input: CliInput<string[] | undefined> = {
    required,
    hidden,
    placeholder,
    getValue(argv) {
      if (!argv) {
        return undefined;
      }

      if (argv.length === 0) {
        throw new CliUsageError(`Expected one or more values ${placeholder}`);
      }

      return argv;
    },
    description
  };
  return input;
}
