import { Command } from './types';
import { CLI_LEAF } from './constants';

type PathAndDescription = {
  path: string[];
  description?: string;
};

export function getPathAndDescriptionOfLeaves(
  command: Command,
  path: string[]
): PathAndDescription[] {
  if (command.hidden && path.length > 0) {
    // ^^ conditional on path.length > 0 because we don't want to hide the usage
    // for the current node, e.g. if a user does `cli hidden-command` it should
    // show the leaves underneath "hidden-command".
    return [];
  }
  if (command.commandType === CLI_LEAF) {
    return [
      {
        path,
        description: command.description
      }
    ];
  }
  const returnValue: PathAndDescription[] = [];
  for (const subcommand of command.subcommands) {
    returnValue.push(
      ...getPathAndDescriptionOfLeaves(subcommand, [...path, subcommand.name])
    );
  }
  return returnValue;
}
