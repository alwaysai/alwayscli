import { UsageError } from './usage-error';

export function checkArgvHasValue(argv: string[]) {
  if (argv.length === 0) {
    throw new UsageError('No value was provided');
  }
}

export function checkArgvLengthLessThan(argv: string[], tooMany = 2) {
  if (argv.length >= tooMany) {
    throw new UsageError('Too many values');
  }
}
