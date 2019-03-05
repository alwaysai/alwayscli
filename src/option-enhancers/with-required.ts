import { Option } from '../types';
import { UsageError } from '../usage-error';

export function withRequired<T>(option: Option<T>) {
  type NextT = Exclude<T, undefined>;
  const nextOption: Option<NextT> = {
    ...option,
    async getValue(argv) {
      if (typeof argv === 'undefined') {
        throw new UsageError('Option is required');
      }
      const value = await option.getValue(argv);
      if (typeof value === 'undefined') {
        throw new Error('Expected getValue to return a value');
      }
      return value as NextT;
    },
  };
  return nextOption;
}
