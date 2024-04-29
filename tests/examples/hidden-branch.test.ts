import { CliArgvInterface } from '../../src/cli-argv-interface';
import { root } from '../../src/examples/hidden-branch';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('has a command "secret echo"', async () => {
    expect(await cli('secret', 'echo', 'foo')).toBe('foo');
  });
});
