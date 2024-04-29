import { CliBranch } from './cli-branch';
import { CliLeaf } from './cli-leaf';
import { LastCommand } from './last-command';

const leaf = CliLeaf({
  name: 'l',
  action() {}
});

const branch = CliBranch({
  name: 'b',
  subcommands: [leaf]
});

describe(LastCommand.name, () => {
  it('returns the passed branch if next is not defined', () => {
    branch.next = undefined;
    const lastCommand = LastCommand(branch);
    expect(lastCommand).toBe(branch);
  });

  it('returns the passed leaf if a leaf is passed', () => {
    const lastCommand = LastCommand(leaf);
    expect(lastCommand).toBe(leaf);
  });

  it('recursively traverses "next" property', () => {
    branch.next = leaf;
    const lastCommand = LastCommand(branch);
    expect(lastCommand).toBe(leaf);
  });
});
