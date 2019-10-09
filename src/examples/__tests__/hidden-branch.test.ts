import { root } from '../hidden-branch';
import { ArgvInterface } from '../../argv-interface';

const cli = ArgvInterface(root);

describe(root.name, () => {
  it('has a command "secret echo"', async () => {
    expect(await cli('secret', 'echo', 'foo')).toBe('foo');
  });
});
