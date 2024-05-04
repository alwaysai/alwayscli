import { CliArgvInterface } from '../../src/cli-argv-interface';
import { echoCliLeaf } from '../../examples/echo';

describe(echoCliLeaf.name, () => {
  it('" "-joins and returns the provided positional args', async () => {
    expect(await CliArgvInterface(echoCliLeaf)('foo', 'bar', 'baz')).toBe(
      'foo bar baz'
    );
  });
});
