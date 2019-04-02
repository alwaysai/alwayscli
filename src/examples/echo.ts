import { createCli, createLeaf, createStringArrayInput, runAndExit } from '..';

export const echo = createLeaf({
  name: 'echo',
  description: 'Print messages to the console',
  options: {},
  args: createStringArrayInput({ required: true }),
  action(messages) {
    return messages.join(' ');
  },
});

const cli = createCli(echo);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
