import { root } from '../hidden-option';
import { ArgvInterface } from '../../argv-interface';

const cli = ArgvInterface(root);

describe(root.name, () => {
  it('normally just echos', async () => {
    expect(await cli('foo')).toEqual('foo');
  });
  it('has a hidden option "--pizza"', async () => {
    expect(await cli('foo', '--pizza')).toMatch('__________');
  });
});
