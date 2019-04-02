import { runAndCatch } from '@carnesen/run-and-catch';
import { createBranch } from './create-branch';
import { createStringInput } from './input-factories/create-string-input';
import { TerseError, TERSE } from './terse-error';
import { createCli } from './create-cli';
import { createLeaf } from './create-leaf';

const ERROR_MESSAGE = 'something very bad has happened';
const leaf = createLeaf({
  name: 'echo',
  options: {
    message: createStringInput({ description: 'A message' }),
  },
  action({ message }) {
    if (message === 'fatal') {
      throw new TerseError(ERROR_MESSAGE);
    }
    return message;
  },
});

const root = createBranch({
  name: 'cli',
  subcommands: [leaf],
});

const cli = createCli(root);

describe(createCli.name, () => {
  it('throws usage string "unknown option name" if an unknown input is provided', async () => {
    const usageString = await runAndCatch(cli, 'echo', '--unknown');
    expect(usageString).toMatch(/unknown option name "--unknown"/im);
  });

  it(`throws string message if a "${TERSE}" error is thrown`, async () => {
    const usageString = await runAndCatch(cli, 'echo', '--message', 'fatal');
    expect(usageString).toBe(`Error: ${ERROR_MESSAGE}`);
  });
});
