import { runAndCatch } from '@carnesen/run-and-catch';

import { CliArgvInterface } from '../../src/cli-argv-interface';
import { root } from '../../examples/throw';

const cli = CliArgvInterface(root);

describe('throw CLI', () => {
  it('throws', async () => {
    const ex = await runAndCatch(cli, '--message', 'foo');
    expect(ex.message).toBe('foo');
  });
});
