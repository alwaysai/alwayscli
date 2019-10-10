import { Command } from './types';
import { CLI_LEAF } from './constants';

export function accumulateCommandStack(
  command: Command,
  restCommandNamesAndPositionalArgv: string[],
): string[] {
  if (command.commandType === CLI_LEAF) {
    return restCommandNamesAndPositionalArgv;
  }

  const found = command.subcommands.find(
    subcommand => subcommand.name === restCommandNamesAndPositionalArgv[0],
  );

  if (!found) {
    command.next = undefined;
    return restCommandNamesAndPositionalArgv;
  }

  command.next = found;

  return accumulateCommandStack(found, restCommandNamesAndPositionalArgv.slice(1));
}
