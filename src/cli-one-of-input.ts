import { CliInput } from './types';
import { CliUsageError } from './cli-usage-error';
import { wrapInCurlyBrackets, regularizeText } from './util';

type Config<TValues extends string[]> = {
  values: TValues;
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
};

export { CliOneOfInput };

function CliOneOfInput<U extends string[]>(
  config: Config<U> & { defaultValue: U }
): CliInput<U[number], false>;
function CliOneOfInput<U extends string[]>(
  config: Config<U> & { required: true }
): CliInput<U[number], true>;
function CliOneOfInput<U extends string[]>(
  config: Config<U>
): CliInput<U[number] | undefined, false>;
function CliOneOfInput(config: Config<string[]>) {
  const valuesString = wrapInCurlyBrackets(config.values.join(', '));
  const {
    required = false,
    description,
    placeholder = '<value>',
    hidden = false
  } = config;

  const input: CliInput<string | undefined> = {
    required,
    placeholder: config.placeholder || '<value>',
    hidden,
    getValue(argv) {
      if (!argv) {
        return;
      }

      if (argv.length !== 1) {
        throw new CliUsageError(
          `Expected ${placeholder} to be one of ${valuesString}`
        );
      }

      if (!config.values.includes(argv[0])) {
        throw new CliUsageError(
          `Invalid argument "${argv[0]}". Expected ${placeholder} to be one of ${valuesString}`
        );
      }
      return argv[0];
    },
    description: `${regularizeText(
      description
    )}\nAllowed values ${valuesString}`
  };
  return input;
}
