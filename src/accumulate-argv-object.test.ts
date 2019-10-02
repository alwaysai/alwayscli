import { accumulateArgvObject } from './accumulate-argv-object';

type Datum = {
  argv: string[];
  result: ReturnType<typeof accumulateArgvObject>;
};

const data: Datum[] = [
  {
    argv: ['foo', 'bar', '--baz', 'jane', 'doe'],
    result: {
      commandNameAndArgsArgv: ['foo', 'bar'],
      foundHelp: false,
      optionsArgvObject: { baz: ['jane', 'doe'] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['foo', 'bar', '--baz', 'jane', '--baz', 'doe'],
    result: {
      commandNameAndArgsArgv: ['foo', 'bar'],
      foundHelp: false,
      optionsArgvObject: { baz: ['jane', 'doe'] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['--', '--foo', '--bar'],
    result: {
      commandNameAndArgsArgv: [],
      foundHelp: false,
      optionsArgvObject: {},
      escapedArgv: ['--foo', '--bar'],
    },
  },
  {
    argv: ['--'],
    result: {
      commandNameAndArgsArgv: [],
      foundHelp: false,
      optionsArgvObject: {},
      escapedArgv: [],
    },
  },
  {
    argv: ['--foo'],
    result: {
      commandNameAndArgsArgv: [],
      foundHelp: false,
      optionsArgvObject: { foo: [] },
      escapedArgv: undefined,
    },
  },
  {
    argv: ['foo', 'bar', '--help', 'baz'],
    result: {
      commandNameAndArgsArgv: ['foo', 'bar', 'baz'],
      foundHelp: true,
      optionsArgvObject: {},
      escapedArgv: undefined,
    },
  },
  {
    argv: ['--', '--help', 'baz'],
    result: {
      commandNameAndArgsArgv: [],
      foundHelp: false,
      optionsArgvObject: {},
      escapedArgv: ['--help', 'baz'],
    },
  },
];

describe(accumulateArgvObject.name, () => {
  for (const { argv, result } of data) {
    it(`${argv.join(' ')}`, () => {
      expect(accumulateArgvObject(...argv)).toEqual(result);
    });
  }
});
