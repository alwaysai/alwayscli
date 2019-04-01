import { createLeaf, createStringInput } from '..';
import { createCli } from '../create-cli';
import { runAndExit } from '@carnesen/run-and-exit';

export const root = createLeaf({
  commandName: 'echo',
  description: 'Print messages to the console',
  namedInputs: {
    message: createStringInput({
      description: 'A message',
      required: true,
    }),
  },
  action({ message }) {
    return message;
  },
});

const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
