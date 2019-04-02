import { accumulateNonHelpArgv } from './accumulate-non-help-argv';

describe(accumulateNonHelpArgv.name, () => {
  it('accumulates as "nonHelpArgv" all the args that are not a call for help', () => {
    expect(accumulateNonHelpArgv('foo', 'bar', '--help')).toEqual({
      foundHelp: true,
      nonHelpArgv: ['foo', 'bar'],
    });
  });
  it('accumulates as "nonHelpArgv" all the args that are not a call for help', () => {
    expect(accumulateNonHelpArgv('foo')).toEqual({
      foundHelp: false,
      nonHelpArgv: ['foo'],
    });
  });
});
