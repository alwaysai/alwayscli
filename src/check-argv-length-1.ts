import { UsageError } from './usage-error';

export function checkArgvLength1(argv: string[]) {
  if (argv.length === 0) {
    throw new UsageError('No value was provided');
  }
  if (argv.length > 1) {
    throw new UsageError('Too many values');
  }
}
