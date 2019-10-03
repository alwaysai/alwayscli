import { accumulateCommandStack } from './accumulate-command-stack';
import { createBranch } from './create-branch';
import { createLeaf } from './create-leaf';

const leaf = createLeaf({
  name: 'echo',
  action(foo) {
    return foo;
  },
});

const root = createBranch({
  name: 'cli',
  subcommands: [leaf],
});

describe(accumulateCommandStack.name, () => {
  it('accumulates command linked list', () => {
    const remainingArgv = accumulateCommandStack(root, ['echo', 'foo']);
    expect(root.next && root.next.name).toBe('echo');
    expect(remainingArgv).toEqual(['foo']);
  });

  it('does not attach a "next" command if the name does not match', () => {
    const remainingArgv = accumulateCommandStack(root, ['bad-command-name']);
    expect(root.next).toBe(undefined);
    expect(remainingArgv).toEqual(['bad-command-name']);
  });
});
