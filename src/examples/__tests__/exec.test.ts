import { runAndCatch } from '@carnesen/run-and-catch';

import { execCliLeaf } from '../exec';
import { CliArgvInterface } from '../../cli-argv-interface';
import { CLI_USAGE_ERROR } from '../../cli-usage-error';

const argvInterface = CliArgvInterface(execCliLeaf);

describe(execCliLeaf.name, () => {
  it('runs the provided command', async () => {
    const output = await argvInterface('--', 'echo', '--foo', '--bar');
    expect(output).toBe('--foo --bar\n');
  });

  it('throws usage', async () => {
    const output = await runAndCatch(argvInterface);
    expect(output.code).toBe(CLI_USAGE_ERROR);
  });
});
