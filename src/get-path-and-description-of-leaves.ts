import { Command } from './types';
import { LEAF } from './constants';

type PathAndDescription = {
  path: string[];
  description?: string;
};

export function getPathAndDescriptionOfLeaves(
  command: Command,
  path: string[],
): PathAndDescription[] {
  if (command.hidden) {
    return [];
  }
  if (command._type === LEAF) {
    return [
      {
        path,
        description: command.description,
      },
    ];
  }
  const returnValue: PathAndDescription[] = [];
  for (const subcommand of command.subcommands) {
    returnValue.push(
      ...getPathAndDescriptionOfLeaves(subcommand, [...path, subcommand.name]),
    );
  }
  return returnValue;
}
