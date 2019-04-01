import { accumulateDashDashArgs } from './accumulate-dash-dash-args';

describe(accumulateDashDashArgs.name, () => {
  it('accumulates as "dashDashArgs" all the args of the form "--name [value0 [...]]"', () => {
    expect(
      accumulateDashDashArgs('foo', 'bar', '--baz', 'jane', 'doe').dashDashArgs,
    ).toEqual({
      baz: ['jane', 'doe'],
    });
  });

  it('accumulates as "nonDashDashArgs" everything up to the first "--whatever"', () => {
    expect(accumulateDashDashArgs('foo', 'bar', '--baz').nonDashDashArgs).toEqual([
      'foo',
      'bar',
    ]);
  });

  it('combines values if a dash dash arg is provided twice', () => {
    expect(
      accumulateDashDashArgs('--baz', 'foo', '--baz', 'bar').dashDashArgs.baz,
    ).toEqual(['foo', 'bar']);
  });
});
