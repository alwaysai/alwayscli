import { createLeaf } from '../create-command';
import { createStringOption } from '../option-factories/create-string-option';
import { createCommandLineInterface } from '../create-command-line-interface';

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
