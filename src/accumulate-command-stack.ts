import { Command, CommandStack } from './types';
import { LEAF, BRANCH } from './constants';

export function accumulateCommandStack(
  rootCommand: Command,
  commandNameAndArgsArgv: string[],
) {
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

  let badCommandName: string | undefined = undefined;
  let index = 0;
  while (
    typeof badCommandName === 'undefined' &&
    !commandStack.leaf &&
    index < commandNameAndArgsArgv.length
  ) {
    const maybeCommandName = commandNameAndArgsArgv[index];
    index = index + 1;
    const branch = commandStack.branches.slice(-1)[0];
    const nextCommand = branch.subcommands.find(
      subcommand => subcommand.name === maybeCommandName,
    );
    if (!nextCommand) {
      badCommandName = maybeCommandName;
      break;
    }
    addToCommandStack(nextCommand);
  }
  const argsArgv = commandNameAndArgsArgv.slice(index);
  return {
    commandStack,
    argsArgv,
    badCommandName,
  };
}
