import { Command } from './types';
import { LEAF } from './constants';

export function accumulateCommandStack(command: Command, argv: string[]): string[] {
  if (command._type === LEAF) {
    return argv;
  }

  const found = command.subcommands.find(subcommand => subcommand.name === argv[0]);

  if (!found) {
    command.next = undefined;
    return argv;
  }

  command.next = found;

  return accumulateCommandStack(found, argv.slice(1));
}
