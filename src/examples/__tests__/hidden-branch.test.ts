import { root } from '../hidden-branch';
import { CliArgvInterface } from '../../cli-argv-interface';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('has a command "secret echo"', async () => {
    expect(await cli('secret', 'echo', 'foo')).toBe('foo');
  });
});
