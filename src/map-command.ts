import { Command } from './types';
import { LEAF } from './constants';

export function mapCommand<T>(command: Command, callback: (command: Command) => T) {
  const result: T[] = [];
  let current = command;
  while (true) {
    result.push(callback(current));
    if (current.commandType === LEAF || !current.next) {
      break;
    }
    current = current.next;
  }
  return result;
}
