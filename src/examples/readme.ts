import { promisify } from 'util';
import { readFile } from 'fs';

import {
  createCli,
  createLeaf,
  createBranch,
  createFlagInput,
  createStringInput,
  createNumberArrayInput,
} from '..';
import { runAndExit } from '@carnesen/run-and-exit';

// A "leaf" command defines an "action" function
export const multiply = createLeaf({
  commandName: 'multiply',
  description: 'Multiply numbers',
  namedInputs: {
    numbers: createNumberArrayInput({ required: true }),
    squareTheResult: createFlagInput(),
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
  namedInputs: {
    filePath: createStringInput({
      description: 'A file path',
      required: true,
    }),
  },
  async action({ filePath }) {
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
    Its only purpose is to demonstrate features.
    `,
  subcommands: [multiply, cat],
});

const cli = createCli(root);

if (require.main === module) {
  runAndExit(cli, ...process.argv.slice(2));
}
