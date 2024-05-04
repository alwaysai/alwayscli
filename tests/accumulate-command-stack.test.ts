import { accumulateCommandStack } from '../src/accumulate-command-stack';
import { CliBranch } from '../src/cli-branch';
import { CliLeaf } from '../src/cli-leaf';

const leaf = CliLeaf({
  name: 'echo',
  action(foo) {
    return foo;
  }
});

const root = CliBranch({
  name: 'cli',
  subcommands: [leaf]
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
