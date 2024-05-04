import { runAndCatch } from '@carnesen/run-and-catch';

import { CliArgvInterface } from '../../src/cli-argv-interface';
import { CLI_USAGE_ERROR } from '../../src/cli-usage-error';
import { execCliLeaf } from '../../examples/exec';

const argvInterface = CliArgvInterface(execCliLeaf);

describe(execCliLeaf.name, () => {
  it('runs the provided command', async () => {
    const output = await argvInterface('--', 'echo', '--foo', '--bar');
    expect(output).toMatch(/^--foo --bar(\r?\n)?$/);
  });

  it('throws usage', async () => {
    const output = await runAndCatch(argvInterface);
    expect(output.code).toBe(CLI_USAGE_ERROR);
  });
});
