import { runAndCatch } from '@carnesen/run-and-catch';

import { cli } from '../throw';

describe('throw CLI', () => {
  it('throws', async () => {
    const ex = await runAndCatch(cli, '--message', 'foo');
    expect(ex.message).toBe('foo');
  });
});
