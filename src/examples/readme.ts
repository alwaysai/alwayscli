import { promisify } from 'util';
import { readFile } from 'fs';
import { isAbsolute } from 'path';

import {
  createLeaf,
  createStringOption,
  createBranch,
  createNumberArrayOption,
  createFlagOption,
  withRequired,
  UsageError,
  createCommandLineInterface,
} from '..';

// A "leaf" command defines an "action" function
export const multiply = createLeaf({
  commandName: 'multiply',
  description: 'Multiply numbers',
  options: {
    numbers: withRequired(createNumberArrayOption()),
    squareTheResult: createFlagOption(),
  },
  action({ numbers, squareTheResult }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squareTheResult) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

export const cat = createLeaf({
  commandName: 'cat',
  description: 'Print the contents of a file',
  options: {
    filePath: withRequired(
      createStringOption({
        description: 'An absolute path',
      }),
    ),
  },
  async action({ filePath }) {
    if (!isAbsolute(filePath)) {
      throw new UsageError('filePath must be absolute');
    }
    const contents = await promisify(readFile)(filePath, { encoding: 'utf8' });
    return contents;
  },
});

// A "branch" command is a container for subcommands which can
// themselves be either "branch" commands or "leaf" commands
export const root = createBranch({
  commandName: 'readme',
  description: `
    This is an example command-line interface (CLI).
    Its only purpose is to demonstrate features.`,
  subcommands: [multiply, cat],
});

const commandLineInterface = createCommandLineInterface(root);

if (require.main === module) {
  commandLineInterface();
}
