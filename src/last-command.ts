import { Command } from './types';
import { LEAF } from './constants';

export function LastCommand(command: Command): Command {
  if (command._type === LEAF) {
    return command;
  }
  if (!command.next) {
    return command;
  }
  return LastCommand(command.next);
}
