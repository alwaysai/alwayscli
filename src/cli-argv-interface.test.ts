import { runAndCatch } from '@carnesen/run-and-catch';
import { CliBranch } from './cli-branch';
import { CliLeaf } from './cli-leaf';
import { dummyInput } from './dummy-inputs-for-testing';
import { CliArgvInterface } from './cli-argv-interface';
import { findVersion } from './find-version';
import { CLI_USAGE_ERROR } from './cli-usage-error';

const leafWithNamedInputs = CliLeaf({
  name: 'leaf-with-named-inputs',
  namedInputs: {
    foo: dummyInput,
  },
  action(...args) {
    return args;
  },
});

const leafWithPositionalInput = CliLeaf({
  name: 'leaf-with-positional-input',
  positionalInput: dummyInput,
  action(...args) {
    return args;
  },
});

const leafWithEscapedInput = CliLeaf({
  name: 'leaf-with-escaped-input',
  escapedInput: dummyInput,
  action(...args) {
    return args;
  },
});

const root = CliBranch({
  name: 'cli',
  subcommands: [leafWithPositionalInput, leafWithNamedInputs, leafWithEscapedInput],
});

const argvInterface = CliArgvInterface(root);

describe(CliArgvInterface.name, () => {
  it('returns version string from package.json if "-v" or "--version" is passed', async () => {
    const version = await findVersion();
    expect(await argvInterface('-v')).toBe(version);
    expect(await argvInterface('--version')).toBe(version);
  });

  it('throws USAGE error with empty message if --help is passed', async () => {
    const exception = await runAndCatch(argvInterface, '--help');
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toBeFalsy();
  });

  it('throws USAGE error with empty message if last command is a branch and no additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface);
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toBeFalsy();
  });

  it('throws USAGE error "bad command" if last command is a branch and additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface, 'oops');
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(/bad command/i);
    expect(exception.message).toMatch('"oops"');
    expect(exception.message).toMatchSnapshot();
  });

  it('throws USAGE error "positional arguments" if last command is a leaf without positionalInput property and additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface, leafWithNamedInputs.name, 'oops');
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch('Unexpected argument "oops"');
    expect(exception.message).toMatch(leafWithNamedInputs.name);
    expect(exception.message).toMatch(/positional arguments/i);
    expect(exception.message).toMatchSnapshot();
  });

  it('Passes parsed positional value as first argument of the "action" function', async () => {
    const positionalArgv = ['foo', 'bar'];
    const result = await argvInterface(leafWithPositionalInput.name, ...positionalArgv);
    expect(result).toEqual([dummyInput.getValue(positionalArgv), {}, undefined]);
  });

  it('Passes parsed named values as second argument of the "action" function', async () => {
    const namedArgv = ['--foo', 'bar'];
    const result = await argvInterface(leafWithNamedInputs.name, ...namedArgv);
    expect(result).toEqual([undefined, { foo: dummyInput.getValue(['bar']) }, undefined]);
  });

  it(`Throws USAGE error 'does not allow "--"' if leaf does not have an "escaped" property`, async () => {
    const exception = await runAndCatch(
      argvInterface,
      leafWithPositionalInput.name,
      '--',
    );
    expect(exception.code).toBe(CLI_USAGE_ERROR);
    expect(exception.message).toMatch(leafWithPositionalInput.name);
    expect(exception.message).toMatch('does not allow "--"');
  });

  it('Passes parsed escaped value as third argument of the "action" function', async () => {
    const result = await argvInterface(leafWithEscapedInput.name, '--');
    expect(result).toEqual([
      undefined,
      {},
      leafWithEscapedInput.escapedInput!.getValue([]),
    ]);
  });
});
