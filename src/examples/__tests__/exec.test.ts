import { cli, root } from '../exec';
import { runAndCatch } from '@carnesen/run-and-catch';

describe(root.name, () => {
  it('runs the provided command', async () => {
    const output = await cli('--', 'echo', '--foo', '--bar');
    expect(output).toBe('--foo --bar\n');
  });

  it('throws usage', async () => {
    const output = await runAndCatch(cli);
    expect(output).toMatch('-- <command> [<arguments>]');
  });
});
