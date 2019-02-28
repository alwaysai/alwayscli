import { createCommandInterface } from './create-command-interface';
import { createLeaf, createBranch } from './create-command';
import { createStringOption } from './option-factories/create-string-option';

const leaf = createLeaf({
  commandName: 'echo',
  options: {
    message: createStringOption({ description: 'A message' }),
  },
  action(foo) {
    return foo;
  },
});

const root = createBranch({
  commandName: 'cli',
  subcommands: [leaf],
});

const commandInterface = createCommandInterface(root);
const catchCommandInterface = async (...args: Parameters<typeof commandInterface>) => {
  try {
    await commandInterface(...args);
    throw new Error('This line should not be reached');
  } catch (ex) {
    return ex;
  }
};

describe(createCommandInterface.name, () => {
  it('throws usage string "unknown option" if an unknown option is provided', async () => {
    const usageString = await catchCommandInterface(['echo', '--unknown-option']);
    expect(usageString.includes('Error: Unknown option "--unknown-option"')).toBe(true);
  });
});
