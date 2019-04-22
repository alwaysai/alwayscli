import { root, cli } from '../hidden-branch';

describe(root.name, () => {
  it('has a command "secret echo"', async () => {
    expect(await cli('secret', 'echo', 'foo')).toBe('foo');
  });
});
