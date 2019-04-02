import { promisify } from 'util';
import { readFile } from 'fs';

import {
  createCli,
  createLeaf,
  createBranch,
  createFlagInput,
  createStringInput,
  createNumberArrayInput,
  runAndExit,
} from '..';

// A "leaf" command defines an "action" function
const multiply = createLeaf({
  name: 'multiply',
  description: 'Multiply numbers',
  options: {
    squareTheResult: createFlagInput({
      description: 'Square the multiplied expression',
    }),
  },
  args: createNumberArrayInput({ required: true }),
  action(numbers, { squareTheResult }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squareTheResult) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

const cat = createLeaf({
  name: 'cat',
  description: 'Print the contents of a file',
  args: createStringInput({
    description: 'A file path',
    required: true,
    placeholder: '<path>',
  }),
  async action(filePath) {
    const contents = await promisify(readFile)(filePath, { encoding: 'utf8' });
    return contents;
  },
});

// A "branch" command is a container for subcommands which can
// themselves be either "branch" commands or "leaf" commands
export const readme = createBranch({
  name: 'readme',
  description: `
    This is an example command-line interface (CLI).
    Its only purpose is to demonstrate features.
    `,
  subcommands: [multiply, cat],
});

const cli = createCli(readme);

if (require.main === module) {
  runAndExit(cli, ...process.argv.slice(2));
}
