import { accumulateArgvs } from './accumulate-argvs';

type Datum = {
  argv: string[];
  result: ReturnType<typeof accumulateArgvs>;
};

const data: Datum[] = [
  {
    argv: ['foo', 'bar', '--baz', 'jane', 'doe'],
    result: {
      commandNamesAndPositionalArgv: ['foo', 'bar'],
      foundHelp: false,
      namedArgvs: { baz: ['jane', 'doe'] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['foo', 'bar', '--baz', 'jane', '--baz', 'doe'],
    result: {
      commandNamesAndPositionalArgv: ['foo', 'bar'],
      foundHelp: false,
      namedArgvs: { baz: ['jane', 'doe'] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['--', '--foo', '--bar'],
    result: {
      commandNamesAndPositionalArgv: [],
      foundHelp: false,
      namedArgvs: {},
      escapedArgv: ['--foo', '--bar'],
    },
  },
  {
    argv: ['--'],
    result: {
      commandNamesAndPositionalArgv: [],
      foundHelp: false,
      namedArgvs: {},
      escapedArgv: [],
    },
  },
  {
    argv: ['--foo'],
    result: {
      commandNamesAndPositionalArgv: [],
      foundHelp: false,
      namedArgvs: { foo: [] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['foo', 'bar', '--help', 'baz'],
    result: {
      commandNamesAndPositionalArgv: ['foo', 'bar', 'baz'],
      foundHelp: true,
      namedArgvs: {},
      escapedArgv: undefined,
    },
  },
  {
    argv: ['--', '--help', 'baz'],
    result: {
      commandNamesAndPositionalArgv: [],
      foundHelp: false,
      namedArgvs: {},
      escapedArgv: ['--help', 'baz'],
    },
  },
];

describe(accumulateArgvs.name, () => {
  for (const { argv, result } of data) {
    it(`${argv.join(' ')}`, () => {
      expect(accumulateArgvs(argv)).toEqual(result);
    });
  }
});
