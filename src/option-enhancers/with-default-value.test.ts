import { Option, Result } from '../types';
import { withDefaultValue } from './with-default-value';

const base: Option<string | undefined> = {
  getValue(argv) {
    if (typeof argv === 'undefined') {
      return;
    }
    return argv[0];
  },
  placeholder: '<val>',
};

const enhanced = withDefaultValue(base, 'foo');

describe(withDefaultValue.name, () => {
  it('enhanced "getValue" returns default value if argv is undefined', async () => {
    expect(await enhanced.getValue(undefined)).toBe('foo');
  });

  it('enhanced "getValue" returns default value original getValue returns undefined', async () => {
    expect(await enhanced.getValue([])).toBe('foo');
  });

  it('enhanced "getValue" returns the value if there is one', async () => {
    expect(await enhanced.getValue(['bar'])).toBe('bar');
  });

  it('enhanced "getValue" returns a value with undefined excluded from its type', () => {
    // $ExpectType string | undefined
    'foo' as Result<typeof base.getValue>;
    // $ExpectType string
    'foo' as Result<typeof enhanced.getValue>;
  });
});
