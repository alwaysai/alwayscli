import { Option } from '../types';

export function withDefaultValue<T>(
  option: Option<T>,
  defaultValue: Exclude<T, undefined>,
) {
  type NextT = Exclude<T, undefined>;
  const nextOption: Option<NextT> = {
    ...option,
    async getValue(argv) {
      if (!argv) {
        return defaultValue;
      }
      const value = await option.getValue(argv);
      if (typeof value === 'undefined') {
        return defaultValue;
      }
      return value as NextT;
    },
  };
  return nextOption;
}
