import { CliBranch } from '../src/cli-branch';
import { CliLeaf } from '../src/cli-leaf';
import { CliStringInput } from '../src/cli-string-input';
import { RED_ERROR } from '../src/constants';
import { Command } from '../src/types';
import { UsageString } from '../src/usage-string';

const messageInput = CliStringInput({ description: 'A string message please' });
const positionalInput = CliStringInput({
  description: 'A word',
  placeholder: '<word>'
});
const escapedInput = CliStringInput({
  description: 'Another word',
  required: true
});

const leaf = CliLeaf({
  name: 'echo',
  positionalInput,
  namedInputs: {
    message: messageInput
  },
  escapedInput,
  action(foo) {
    return foo;
  }
});

const root = CliBranch({
  name: 'cli',
  description: 'This is a CLI',
  subcommands: [leaf]
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
    expect(usageString).toMatch(messageInput?.description ?? '');
    expect(usageString).toMatchSnapshot();
  });

  it('Creates a usage string for a leaf without a parent branch', () => {
    const usageString = UsageString(leaf as Command);
    expect(usageString).toMatchSnapshot();
  });

  it('Writes an error message at the end if one is provided', () => {
    const usageString = UsageString(root, 'foo');
    expect(usageString.endsWith(`${RED_ERROR} foo`)).toBe(true);
  });

  it('Does not write usage for named inputs if there are none', () => {
    const usageString = UsageString(
      CliLeaf({ name: 'foo', action: jest.fn() })
    );
    expect(
      UsageString(CliLeaf({ name: 'foo', action: jest.fn(), namedInputs: {} }))
    ).toBe(usageString);
    expect(usageString).toMatchSnapshot();
  });
});
