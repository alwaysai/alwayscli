import { runAndCatch } from '@carnesen/run-and-catch';
import { createBranch } from './create-branch';
import { createStringInput } from './input-factories/create-string-input';
import { TerseError, TERSE } from './terse-error';
import { createCli } from './create-cli';
import { createLeaf } from './create-leaf';
import { RED_ERROR } from './constants';
import { Input } from './types';

const ERROR_MESSAGE = 'something very bad has happened';

const optionThatThrows: Input<string, false> = {
  placeholder: '<foo>',
  getDescription: () => '',
  getValue(argv) {
    if (argv) {
      throw new Error('option that throws');
    }
    return 'value';
  },
};

const leaf = createLeaf({
  name: 'echo',
  options: {
    message: createStringInput({ description: 'A message' }),
    optionThatThrows,
  },
  action(_, { message }) {
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
    expect(usageString).toBe(`${RED_ERROR} ${ERROR_MESSAGE}`);
  });

  it(`throws a good message if getValue throws`, async () => {
    const ex = await runAndCatch(cli, 'echo', '--optionThatThrows');
    expect(ex).toBe(`${RED_ERROR} "--optionThatThrows": option that throws`);
  });

  it('returns version string from package.json if "-v" or "--version" is passed', async () => {
    const version = require('../package.json').version;
    expect(await cli('-v')).toBe(version);
    expect(await cli('--version')).toBe(version);
  });
});
