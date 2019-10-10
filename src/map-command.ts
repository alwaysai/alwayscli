import { Command } from './types';
import { CLI_LEAF } from './constants';

export function mapCommand<T>(command: Command, callback: (command: Command) => T) {
  const result: T[] = [];
  let current = command;
  while (true) {
    result.push(callback(current));
    if (current.commandType === CLI_LEAF || !current.next) {
      break;
    }
    current = current.next;
  }
  return result;
}
