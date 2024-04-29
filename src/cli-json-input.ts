import { CliInput } from './types';
import { CliUsageError } from './cli-usage-error';

type Config = Partial<{
  description: string;
  required: boolean;
  placeholder: string;
  hidden: boolean;
}>;

// Because a JSON input value has type `any`, we don't need to do anything fancy
// with function overloads to handle the "required" field like we do for other
// input factories.
export function CliJsonInput(config: Config = {}) {
  const {
    placeholder = '<json>',
    required = false,
    description,
    hidden = false
  } = config;
  const input: CliInput<any> = {
    required,
    placeholder,
    hidden,
    getValue(argv) {
      if (!argv) {
        return;
      }
      if (argv.length !== 1) {
        throw new CliUsageError(`Expected a single ${placeholder} string`);
      }
      try {
        const parsed = JSON.parse(argv[0]);
        return parsed;
      } catch (exception) {
        if (exception instanceof Error) {
          throw new CliUsageError(exception.message);
        } else {
          throw exception;
        }
      }
    },
    description
  };
  return input;
}
