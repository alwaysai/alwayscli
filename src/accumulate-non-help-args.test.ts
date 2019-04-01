import { accumulateNonHelpArgs } from './accumulate-non-help-args';

describe(accumulateNonHelpArgs.name, () => {
  it('accumulates as "nonHelpArgs" all the args that are not a call for help', () => {
    expect(accumulateNonHelpArgs('foo', 'bar', '--help')).toEqual({
      foundHelp: true,
      nonHelpArgs: ['foo', 'bar'],
    });
  });
  it('accumulates as "nonHelpArgs" all the args that are not a call for help', () => {
    expect(accumulateNonHelpArgs('foo')).toEqual({
      foundHelp: false,
      nonHelpArgs: ['foo'],
    });
  });
});
