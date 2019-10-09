import { root } from '../hidden-leaf';
import { ArgvInterface } from '../../argv-interface';

const cli = ArgvInterface(root);

describe(root.name, () => {
  it('has a hidden leaf "hidden-echo"', async () => {
    expect(await cli('hidden-echo', 'foo')).toBe('foo');
  });
});
