import { root } from '../hidden-option';
import { CliArgvInterface } from '../../cli-argv-interface';

const cli = CliArgvInterface(root);

describe(root.name, () => {
  it('normally just echos', async () => {
    expect(await cli('foo')).toEqual('foo');
  });
  it('has a hidden option "--pizza"', async () => {
    expect(await cli('foo', '--pizza')).toMatch('__________');
  });
});
