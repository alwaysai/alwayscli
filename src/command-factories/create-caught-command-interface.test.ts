import { createCaughtCommandInterface } from './create-caught-command-interface';
import { createLeaf, createBranch } from './create-command';
import { createStringOption } from '../option-factories/create-string-option';
import { FatalError } from '../fatal-error';

const ERROR_MESSAGE = 'something very bad has happened';
const leaf = createLeaf({
  commandName: 'echo',
  options: {
    message: createStringOption({ description: 'A message' }),
  },
  action({ message }) {
    if (message === 'fatal') {
      throw new FatalError(ERROR_MESSAGE);
    }
    return message;
  },
});

const root = createBranch({
  commandName: 'cli',
  subcommands: [leaf],
});

const caughtCommandInterface = createCaughtCommandInterface(root);

describe(createCaughtCommandInterface.name, () => {
  it('throws usage string "unknown option" if an unknown option is provided', async () => {
    const usageString = await caughtCommandInterface(['echo', '--unknown-option']);
    expect(usageString.includes('Error: Unknown option "--unknown-option"')).toBe(true);
  });

  it('throws string message if a FATAL error is thrown', async () => {
    const usageString = await caughtCommandInterface(['echo', '--message', 'fatal']);
    expect(usageString).toBe(`Error: ${ERROR_MESSAGE}`);
  });
});
