import { Input } from '../types';
import { UsageError } from '../usage-error';
import { wrapInSingleQuotes, wrapInCurlyBrackets, regularizeText } from '../util';

type Config<U extends string[]> = {
  values: U;
  required?: boolean;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
};

export { createOneOfInput };

function createOneOfInput<U extends string[]>(
  config: Config<U> & { defaultValue: U },
): Input<U[number], false>;
function createOneOfInput<U extends string[]>(
  config: Config<U> & { required: true },
): Input<U[number], true>;
function createOneOfInput<U extends string[]>(
  config: Config<U>,
): Input<U[number] | undefined, false>;
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
  const input: Input<string | undefined> = {
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
    getDescription() {
      let description = regularizeText(config.description);
      description += `\nAllowed values ${valuesString}`;
      return description;
    },
  };
  return input;
}
