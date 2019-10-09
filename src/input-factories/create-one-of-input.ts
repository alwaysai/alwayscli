import { CliInput } from '../types';
import { UsageError } from '../usage-error';
import { wrapInSingleQuotes, wrapInCurlyBrackets, regularizeText } from '../util';

type Config<TValues extends string[]> = {
  values: TValues;
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
};

export { createOneOfInput };

function createOneOfInput<U extends string[]>(
  config: Config<U> & { defaultValue: U },
): CliInput<U[number], false>;
function createOneOfInput<U extends string[]>(
  config: Config<U> & { required: true },
): CliInput<U[number], true>;
function createOneOfInput<U extends string[]>(
  config: Config<U>,
): CliInput<U[number] | undefined, false>;
function createOneOfInput(config: Config<string[]>) {
  if (!Array.isArray(config.values)) {
    // This would only ever be thrown during development
    throw new Error(
      `Config for a ${createOneOfInput.name} input must have a "values" array`,
    );
  }
  const valuesString = wrapInCurlyBrackets(
    config.values.map(wrapInSingleQuotes).join(', '),
  );

  const input: CliInput<string | undefined> = {
    required: config.required,
    placeholder: config.placeholder || '<value>',
    hidden: config.hidden,
    getValue(argv) {
      if (!argv) {
        return;
      }
      if (!config.values.includes(argv[0])) {
        throw new UsageError(`Expected value to be one of ${valuesString}`);
      }
      return argv[0];
    },
    description: `${regularizeText(config.description)}\nAllowed values ${valuesString}`,
  };
  return input;
}
