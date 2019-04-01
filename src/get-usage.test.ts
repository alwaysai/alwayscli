import { getUsage } from './get-usage';
import { createBranch } from './create-branch';
import { createStringInput } from './input-factories/create-string-input';
import { Leaf } from './types';
import { createLeaf } from './create-leaf';

const leaf = createLeaf({
  commandName: 'echo',
  namedInputs: {
    message: createStringInput({ description: 'A message' }),
  },
  action(foo) {
    return foo;
  },
});

const root = createBranch({
  commandName: 'cli',
  subcommands: [leaf],
});

describe(getUsage.name, () => {
  it('Creates a usage string for a branch', () => {
    const usageString = getUsage([root]);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf', () => {
    const usageString = getUsage([root, leaf as Leaf<any>]);
    expect(usageString).toMatchSnapshot();
  });
});
