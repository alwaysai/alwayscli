import { echoCliLeaf } from '../echo';
import { ArgvInterface } from '../../argv-interface';

describe(echoCliLeaf.name, () => {
  it('" "-joins and returns the provided positional args', async () => {
    expect(await ArgvInterface(echoCliLeaf)('foo', 'bar', 'baz')).toBe('foo bar baz');
  });
});
