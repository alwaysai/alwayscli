import { Result } from '../types';
import { createStringArrayOption } from './create-string-array-option';

const option = createStringArrayOption({ description: 'foo bar baz' });

describe(createStringArrayOption.name, () => {
  it('returns the whole of argv', () => {
    expect(option.getValue(['foo', 'bar', 'baz'])).toEqual(['foo', 'bar', 'baz']);
  });

  it('returns undefined if argv is', () => {
    expect(option.getValue()).toBe(undefined);
  });

  it('getValue result type is string[] | undefined', () => {
    // $ExpectType string[] | undefined
    [] as Result<typeof option.getValue>;
  });

  it('getDescription returns description', () => {
    expect(option.getDescription!()).toBe('foo bar baz');
  });

  it('getDescription returns undefined if there is no description', () => {
    expect(createStringArrayOption().getDescription!()).toBe(undefined);
  });
});
