import { getUsage } from './get-usage';
import { createBranch } from './create-branch';
import { createStringInput } from './input-factories/create-string-input';
import { createLeaf } from './create-leaf';
import { Command } from './types';

const leaf = createLeaf({
  name: 'echo',
  options: {
    message: createStringInput({ description: 'A message' }),
  },
  action(foo) {
    return foo;
  },
});

const root = createBranch({
  name: 'cli',
  subcommands: [leaf],
});

describe(getUsage.name, () => {
  it('Creates a usage string for a branch', () => {
    root.next = undefined;
    const usageString = getUsage(root);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf', () => {
    root.next = leaf;
    const usageString = getUsage(root);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf without a parent branch', () => {
    const usageString = getUsage(leaf as Command);
    expect(usageString).toMatchSnapshot();
  });
});
