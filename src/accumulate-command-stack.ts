import { Command, CommandStack } from './types';
import { LEAF, BRANCH } from './constants';

export function accumulateCommandStack(rootCommand: Command, nonDashDashArgs: string[]) {
  const commandStack: CommandStack = {
    branches: [],
    leaf: undefined,
  };

  function addToCommandStack(command: Command) {
    switch (command._type) {
      case BRANCH:
        commandStack.branches.push(command);
        break;
      case LEAF:
        commandStack.leaf = command;
        break;
      default:
        throw new Error('Unexpected command type');
    }
  }

  addToCommandStack(rootCommand);

  let badCommand: string | undefined = undefined;
  let index = 0;
  while (
    typeof badCommand === 'undefined' &&
    !commandStack.leaf &&
    index < nonDashDashArgs.length
  ) {
    const nonDashDashArg = nonDashDashArgs[index];
    index = index + 1;
    const branch = commandStack.branches.slice(-1)[0];
    const nextCommand = branch.subcommands.find(
      subcommand => subcommand.name === nonDashDashArg,
    );
    if (!nextCommand) {
      badCommand = nonDashDashArg;
      break;
    }
    addToCommandStack(nextCommand);
  }
  const positionalArgs = nonDashDashArgs.slice(index);
  return {
    commandStack,
    positionalArgs,
    badCommand,
  };
}
