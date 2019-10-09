import { runAndCatch } from '@carnesen/run-and-catch';

import { execCliLeaf } from '../exec';
import { ArgvInterface } from '../../argv-interface';
import { USAGE } from '../../usage-error';

const argvInterface = ArgvInterface(execCliLeaf);

describe(execCliLeaf.name, () => {
  it('runs the provided command', async () => {
    const output = await argvInterface('--', 'echo', '--foo', '--bar');
    expect(output).toBe('--foo --bar\n');
  });

  it('throws usage', async () => {
    const output = await runAndCatch(argvInterface);
    expect(output.code).toBe(USAGE);
  });
});
