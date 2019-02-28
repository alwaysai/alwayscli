import { accumulateArgv } from './accumulate-argv';

describe(accumulateArgv.name, () => {
  it('accumulates as "maybeCommandNames" everything up to the first "--whatever"', () => {
    expect(accumulateArgv(['foo', 'bar', '--baz']).maybeCommandNames).toEqual([
      'foo',
      'bar',
    ]);
  });

  it('throws "provided twice" if option is provided twice', () => {
    expect(() => accumulateArgv(['--baz', '--baz'])).toThrow('provided twice');
  });
});
