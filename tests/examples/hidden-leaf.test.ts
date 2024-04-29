import { CliArgvInterface } from '../../src/cli-argv-interface';
import { root } from '../../src/examples/hidden-leaf';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('has a hidden leaf "hidden-echo"', async () => {
    expect(await cli('hidden-echo', 'foo')).toBe('foo');
  });
});
