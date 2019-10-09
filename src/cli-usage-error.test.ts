import { CliUsageError, USAGE } from './cli-usage-error';

describe(CliUsageError.name, () => {
  it('Constructs an error object with property "code" set to "USAGE"', () => {
    const error = new CliUsageError();
    expect(error.code).toBe(USAGE);
    expect(error.message).toBe('');
  });

  it('Constructs an error object with property "code" set to "USAGE" with provided message', () => {
    const message = 'this is a message';
    const error = new CliUsageError(message);
    expect(error.code).toBe(USAGE);
    expect(error.message).toBe(message);
  });
});
