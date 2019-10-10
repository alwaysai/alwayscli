import { runAndCatch } from '@carnesen/run-and-catch';

import { root } from '../throw';
import { CliArgvInterface } from '../../cli-argv-interface';

const cli = CliArgvInterface(root);

describe('throw CLI', () => {
  it('throws', async () => {
    const ex = await runAndCatch(cli, '--message', 'foo');
    expect(ex.message).toBe('foo');
  });
});
