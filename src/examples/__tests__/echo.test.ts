import { cli, root } from '../echo';

describe(root.name, () => {
  it('" "-joins and returns the provided positional args', async () => {
    expect(await cli('foo', 'bar', 'baz')).toBe('foo bar baz');
  });
});
