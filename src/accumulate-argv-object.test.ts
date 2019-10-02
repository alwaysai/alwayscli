import { accumulateArgvObject } from './accumulate-argv-object';

describe(accumulateArgvObject.name, () => {
  it('accumulates as "dashDashArgs" all the args of the form "--name [value0 [...]]"', () => {
    expect(
      accumulateArgvObject('foo', 'bar', '--baz', 'jane', 'doe').optionsArgvObject,
    ).toEqual({
      baz: ['jane', 'doe'],
    });
  });

  it('accumulates as "nonDashDashArgs" everything up to the first "--whatever"', () => {
    expect(accumulateArgvObject('foo', 'bar', '--baz').commandNameAndArgsArgv).toEqual([
      'foo',
      'bar',
    ]);
  });

  it('combines values if a dash dash arg is provided twice', () => {
    expect(
      accumulateArgvObject('--baz', 'foo', '--baz', 'bar').optionsArgvObject.baz,
    ).toEqual(['foo', 'bar']);
  });
});
