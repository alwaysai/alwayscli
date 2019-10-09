import { CliCommand } from './types';
import { LEAF } from './constants';

export function mapCommand<T>(command: CliCommand, callback: (command: CliCommand) => T) {
  const result: T[] = [];
  let current = command;
  while (true) {
    result.push(callback(current));
    if (current._type === LEAF || !current.next) {
      break;
    }
    current = current.next;
  }
  return result;
}
