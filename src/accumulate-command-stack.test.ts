import { accumulateCommandStack } from './accumulate-command-stack';
import { createLeaf, createBranch } from './command-factories/create-command';

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
    const commandStack = [root];
    accumulateCommandStack(commandStack, ['echo']);
    expect(commandStack[0]).toBe(root);
    expect(commandStack[1]).toBe(leaf);
  });

  it('throws UsageError "Bad command" if bad command name is provided', () => {
    try {
      const commandStack = [root];
      accumulateCommandStack(commandStack, ['eco']);
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.code).toEqual('USAGE');
      expect(ex.message).toMatch(/bad command/i);
    }
  });

  it('throws UsageError "does not have subcommands" if too many commands are given', () => {
    try {
      const commandStack = [root];
      accumulateCommandStack(commandStack, ['echo', 'foo']);
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.code).toEqual('USAGE');
      expect(ex.message).toMatch(/does not have subcommands/i);
    }
  });

  it('throws "unexpected command type" if passed an unexpected command type', () => {
    try {
      const badRoot = { ...root, commandType: 'bogus' };
      const commandStack = [badRoot as typeof root];
      accumulateCommandStack(commandStack, ['echo', 'foo']);
      throw new Error('This line should not be reached');
    } catch (ex) {
      expect(ex.message).toMatch(/unexpected command type/i);
    }
  });
});
