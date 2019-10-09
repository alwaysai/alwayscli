import { UsageString } from './usage-string';
import { CliBranch } from './cli-branch';
import { createStringInput } from './input-factories/create-string-input';
import { CliLeaf } from './cli-leaf';
import { CliCommand } from './types';

const leaf = CliLeaf({
  name: 'echo',
  options: {
    message: createStringInput({ description: 'A message' }),
  },
  action(foo) {
    return foo;
  },
});

const root = CliBranch({
  name: 'cli',
  subcommands: [leaf],
});

describe(UsageString.name, () => {
  it('Creates a usage string for a branch', () => {
    root.next = undefined;
    const usageString = UsageString(root);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf', () => {
    root.next = leaf;
    const usageString = UsageString(root);
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf without a parent branch', () => {
    const usageString = UsageString(leaf as CliCommand);
    expect(usageString).toMatchSnapshot();
  });
});
