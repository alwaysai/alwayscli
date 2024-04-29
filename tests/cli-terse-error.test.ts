import { CLI_TERSE_ERROR, CliTerseError } from '../src/cli-terse-error';

describe(CliTerseError.name, () => {
  it('Constructs an error object with property "code" set to "TERSE" with provided message', () => {
    const message = 'this is a message';
    const error = new CliTerseError(message);
    expect(error.code).toBe(CLI_TERSE_ERROR);
    expect(error.message).toBe(message);
  });
});
