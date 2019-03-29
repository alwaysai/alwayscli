import { createLeaf, createStringOption } from '..';
import { createCli } from '../create-cli';
import { runAndExit } from '@carnesen/run-and-exit';

export const root = createLeaf({
  commandName: 'echo',
  description: 'Print messages to the console',
  options: {
    message: createStringOption({
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
