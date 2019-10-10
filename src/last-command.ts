import { Command } from './types';
import { CLI_LEAF } from './constants';

export function LastCommand(command: Command): Command {
  if (command.commandType === CLI_LEAF) {
    return command;
  }
  if (!command.next) {
    return command;
  }
  return LastCommand(command.next);
}
