import { root, cli } from '../hidden-leaf';

describe(root.name, () => {
  it('has a hidden leaf "hidden-echo"', async () => {
    expect(await cli('hidden-echo', 'foo')).toBe('foo');
  });
});
