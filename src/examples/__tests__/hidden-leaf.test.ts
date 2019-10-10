import { root } from '../hidden-leaf';
import { CliArgvInterface } from '../../cli-argv-interface';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('has a hidden leaf "hidden-echo"', async () => {
    expect(await cli('hidden-echo', 'foo')).toBe('foo');
  });
});
