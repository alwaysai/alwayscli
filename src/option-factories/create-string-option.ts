import { Option } from '../types';
import { FatalError } from '../fatal-error';

type BaseConfig = Partial<{
  description: string;
  required: boolean;
  defaultValue: string;
}>;
const placeholder = '<str>';

export { createStringOption };
function createStringOption(
  config: BaseConfig & { defaultValue: string },
): Option<string, false>;
function createStringOption(
  config: BaseConfig & { required: true },
): Option<string, true>;
function createStringOption(config?: BaseConfig): Option<string | undefined, false>;
function createStringOption(config: BaseConfig = {}) {
  const { defaultValue, required, description } = config;
  const option: Option<string | undefined> = {
    getValue(argv) {
      if (!argv) {
        return typeof defaultValue === 'string' ? defaultValue : undefined;
      }

      if (argv.length > 1) {
        throw new FatalError(`Expected just one ${placeholder}`);
      }

      if (argv.length !== 1) {
        throw new FatalError(`Expected a ${placeholder}`);
      }

      return argv[0];
    },
    getDescription() {
      return description;
    },
    placeholder,
    required,
  };
  return option;
}
