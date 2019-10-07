import { UsageError, USAGE } from './usage-error';

describe(UsageError.name, () => {
  it('Constructs an error object with property "code" set to "USAGE"', () => {
    const error = new UsageError();
    expect(error.code).toBe(USAGE);
    expect(error.message).toBe('');
  });

  it('Constructs an error object with property "code" set to "USAGE" with provided message', () => {
    const message = 'this is a message';
    const error = new UsageError(message);
    expect(error.code).toBe(USAGE);
    expect(error.message).toBe(message);
  });
});
