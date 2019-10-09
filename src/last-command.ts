import { CliCommand } from './types';
import { LEAF } from './constants';

export function LastCommand(command: CliCommand): CliCommand {
  if (command._type === LEAF) {
    return command;
  }
  if (!command.next) {
    return command;
  }
  return LastCommand(command.next);
}
