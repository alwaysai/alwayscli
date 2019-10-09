import { echoCliLeaf } from '../echo';
import { CliArgvInterface } from '../../cli-argv-interface';

describe(echoCliLeaf.name, () => {
  it('" "-joins and returns the provided positional args', async () => {
    expect(await CliArgvInterface(echoCliLeaf)('foo', 'bar', 'baz')).toBe('foo bar baz');
  });
});
