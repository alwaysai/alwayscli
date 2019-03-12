import { createLeaf, createStringOption, createCommandLineInterface } from '..';

export const echo = createLeaf({
  commandName: 'echo',
  description: 'Print messages to the console',
  options: {
    message: createStringOption({
      description: 'A message',
    }),
  },
  action({ message }) {
    return message;
  },
});

if (module === require.main) {
  createCommandLineInterface(echo)();
}
