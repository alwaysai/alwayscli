import { getUsageString } from './get-usage-string';
import { createBranch } from './create-branch';
import { createStringOption } from './option-factories/create-string-option';
import { Leaf } from './types';
import { createLeaf } from './create-leaf';

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

describe(getUsageString.name, () => {
  it('Creates a usage string for a branch', () => {
    const usageString = getUsageString([root]);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf', () => {
    const usageString = getUsageString([root, leaf as Leaf<any>]);
    expect(usageString).toMatchSnapshot();
  });
});
