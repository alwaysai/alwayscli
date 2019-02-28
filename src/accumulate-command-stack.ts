import { UsageError } from './usage-error';
import { Command } from './types';
import { LEAF, BRANCH } from './constants';

export function accumulateCommandStack(
  commandStack: Command[],
  maybeCommandNames: string[],
) {
  for (const maybeCommandName of maybeCommandNames) {
    const command = commandStack.slice(-1)[0];
    // ^^ Last item in the "commandStack" array
    switch (command.commandType) {
      case BRANCH:
        const nextCommand = command.subcommands.find(
          subcommand => subcommand.commandName === maybeCommandName,
        );
        if (!nextCommand) {
          throw new UsageError(`Bad command "${maybeCommandName}"`);
        }
        commandStack.push(nextCommand);
        break;
      case LEAF:
        // This means we're still processing "command name" args, but
        // there's already a "leaf" command at the end of the stack.
        throw new UsageError(
          `Command "${command.commandName}" does not have subcommands`,
        );
      default:
        throw new Error('Unexpected command type');
    }
  }
}
