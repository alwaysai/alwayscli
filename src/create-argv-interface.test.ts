import { runAndCatch } from '@carnesen/run-and-catch';
import { createBranch } from './create-branch';
import { createLeaf } from './create-leaf';
import { dummyInput } from './dummy-inputs-for-testing';
import { createArgvInterface } from './create-argv-interface';
import { findVersion } from './find-version';
import { USAGE } from './usage-error';

const leafWithNamedInputs = createLeaf({
  name: 'leaf-with-named-inputs',
  options: {
    foo: dummyInput,
  },
  action(...args) {
    return args;
  },
});

const leafWithPositionalInput = createLeaf({
  name: 'leaf-with-positional-input',
  args: dummyInput,
  action(...args) {
    return args;
  },
});

const leafWithEscapedInput = createLeaf({
  name: 'leaf-with-escaped-input',
  escaped: dummyInput,
  action(...args) {
    return args;
  },
});

const root = createBranch({
  name: 'cli',
  subcommands: [leafWithPositionalInput, leafWithNamedInputs, leafWithEscapedInput],
});

const argvInterface = createArgvInterface(root);

describe(createArgvInterface.name, () => {
  it('returns version string from package.json if "-v" or "--version" is passed', async () => {
    const version = await findVersion();
    expect(await argvInterface(['-v'])).toBe(version);
    expect(await argvInterface(['--version'])).toBe(version);
  });

  it('throws USAGE error with empty message if --help is passed', async () => {
    const exception = await runAndCatch(argvInterface, ['--help']);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toBeFalsy();
  });

  it('throws USAGE error with empty message if last command is a branch and no additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface, []);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toBeFalsy();
  });

  it('throws USAGE error "bad command" if last command is a branch and additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface, ['oops']);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(/bad command/i);
    expect(exception.message).toMatch('"oops"');
    expect(exception.message).toMatchSnapshot();
  });

  it('throws USAGE error "positional arguments" if last command is a leaf without positionalInput property and additional argv is present', async () => {
    const exception = await runAndCatch(argvInterface, [
      leafWithNamedInputs.name,
      'oops',
    ]);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch('Unexpected argument "oops"');
    expect(exception.message).toMatch(leafWithNamedInputs.name);
    expect(exception.message).toMatch(/positional arguments/i);
    expect(exception.message).toMatchSnapshot();
  });

  it('Passes parsed positional value as first argument of the "action" function', async () => {
    const positionalArgv = ['foo', 'bar'];
    const result = await argvInterface([leafWithPositionalInput.name, ...positionalArgv]);
    expect(result).toEqual([dummyInput.getValue(positionalArgv), {}, undefined]);
  });

  it('Passes parsed named values as second argument of the "action" function', async () => {
    const namedArgv = ['--foo', 'bar'];
    const result = await argvInterface([leafWithNamedInputs.name, ...namedArgv]);
    expect(result).toEqual([undefined, { foo: dummyInput.getValue(['bar']) }, undefined]);
  });

  it(`Throws USAGE error 'does not allow "--"' if leaf does not have an "escaped" property`, async () => {
    const exception = await runAndCatch(argvInterface, [
      leafWithPositionalInput.name,
      '--',
    ]);
    expect(exception.code).toBe(USAGE);
    expect(exception.message).toMatch(leafWithPositionalInput.name);
    expect(exception.message).toMatch('does not allow "--"');
  });

  it('Passes parsed escaped value as third argument of the "action" function', async () => {
    const result = await argvInterface([leafWithEscapedInput.name, '--']);
    expect(result).toEqual([undefined, {}, leafWithEscapedInput.escaped!.getValue([])]);
  });
});
