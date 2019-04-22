import {
  createCli,
  createLeaf,
  createFlagInput,
  createNumberArrayInput,
  runAndExit,
} from '..';

export const root = createLeaf({
  name: 'multiply',
  description: 'Multiply numbers and print the result',
  args: createNumberArrayInput({ required: true }),
  options: {
    squared: createFlagInput({
      description: 'Square the result before printing it',
    }),
  },
  action(args, { squared }) {
    const multiplied = args.reduce((a, b) => a * b, 1);
    if (squared) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

export const cli = createCli(root);

if (require.main === module) {
  runAndExit(cli, ...process.argv.slice(2));
}
