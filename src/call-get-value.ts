import { CliInput } from './types';
import { CliUsageError } from './cli-usage-error';

export async function callGetValue(
  input: CliInput<any>,
  argv?: string[],
  context?: string
) {
  const { required, placeholder, getValue } = input;
  let prefix = [context, placeholder].filter(Boolean).join(' ');
  if (prefix) {
    prefix += ' : ';
  }
  if (required && (!argv || argv.length === 0)) {
    throw new CliUsageError(`${prefix}Input is required`);
  }
  try {
    return await getValue(argv);
  } catch (exception) {
    if (
      exception instanceof Error &&
      exception &&
      typeof exception.message === 'string'
    ) {
      exception.message = `${prefix}${exception.message}`;
    }
    throw exception;
  }
}
