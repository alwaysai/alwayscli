import { CliArgvInterface } from '../../src/cli-argv-interface';
import { root } from '../../examples/hidden-option';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('normally just echos', async () => {
    expect(await cli('foo')).toEqual('foo');
  });
  it('has a hidden option "--pizza"', async () => {
    expect(await cli('foo', '--pizza')).toMatch('__________');
  });
});
