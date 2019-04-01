import { accumulateCommandStack } from './accumulate-command-stack';
import { createBranch } from './create-branch';
import { createLeaf } from './create-leaf';
import { runAndCatch } from '@carnesen/run-and-catch';
import { Command } from './types';

const leaf = createLeaf({
  commandName: 'echo',
  action(foo) {
    return foo;
  },
});

const root = createBranch({
  commandName: 'cli',
  subcommands: [leaf],
});

describe(accumulateCommandStack.name, () => {
  it('accumulates commands into commandStack based on passed maybe command names', () => {
    const { commandStack, badCommand, positionalArgs } = accumulateCommandStack(root, [
      'echo',
      'foo',
    ]);
    expect(commandStack.branches[0]).toBe(root);
    expect(commandStack.leaf).toBe(leaf);
    expect(badCommand).toBe(undefined);
    expect(positionalArgs).toEqual(['foo']);
  });

  it('returns badCommand if bad command name is provided', () => {
    const { commandStack, badCommand } = accumulateCommandStack(root, ['eco']);
    expect(badCommand).toEqual('eco');
    expect(commandStack.branches).toEqual([root]);
  });

  it('throws "unexpected command type" if passed an unexpected command type', async () => {
    const badRoot = { ...root, commandType: 'bogus' };
    const ex = await runAndCatch(accumulateCommandStack, badRoot as Command, [
      'echo',
      'foo',
    ]);
    expect(ex.message).toMatch(/unexpected command type/i);
  });
});
