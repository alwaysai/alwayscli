import { Option, Result } from '../types';
import { withRequired } from './with-required';

const base: Option<string | undefined> = {
  getValue(argv) {
    if (typeof argv === 'undefined') {
      return;
    }
    return argv[0];
  },
  placeholder: '<val>',
};

const enhanced = withRequired(base);

describe(withRequired.name, () => {
  it('enhanced "getValue" throws usage error if argv is undefined', async () => {
    try {
      await enhanced.getValue(undefined);
      throw new Error('This line should never be reached');
    } catch (ex) {
      expect(ex.code).toBe('USAGE');
      expect(ex.message).toMatch('required');
    }
  });

  it('enhanced "getValue" throws error if original returns undefined', async () => {
    try {
      await enhanced.getValue([]);
      throw new Error('This line should never be reached');
    } catch (ex) {
      expect(ex.code).not.toBe('USAGE');
      expect(ex.message).toMatch('return a value');
    }
  });

  it('enhanced "getValue" returns the value if there is one', async () => {
    expect(await enhanced.getValue(['foo'])).toBe('foo');
  });

  it('enhanced "getValue" returns a value with undefined excluded from its type', () => {
    // $ExpectType string | undefined
    'foo' as Result<typeof base.getValue>;
    // $ExpectType string
    'foo' as Result<typeof enhanced.getValue>;
  });
});
