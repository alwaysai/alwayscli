import { CliTerseError, TERSE } from './cli-terse-error';

describe(CliTerseError.name, () => {
  it('Constructs an error object with property "code" set to "TERSE" with provided message', () => {
    const message = 'this is a message';
    const error = new CliTerseError(message);
    expect(error.code).toBe(TERSE);
    expect(error.message).toBe(message);
  });
});
