import { Command } from './types';
import { LEAF } from './constants';

export function accumulateCommandStack(
  command: Command,
  remainingCommandNameAndArgsArgv: string[],
): string[] {
  if (command._type === LEAF) {
    return remainingCommandNameAndArgsArgv;
  }

  const found = command.subcommands.find(
    subcommand => subcommand.name === remainingCommandNameAndArgsArgv[0],
  );

  if (!found) {
    command.next = undefined;
    return remainingCommandNameAndArgsArgv;
  }

  command.next = found;

  return accumulateCommandStack(found, remainingCommandNameAndArgsArgv.slice(1));
}
