import { TerseError, TERSE } from './terse-error';

describe(TerseError.name, () => {
  it('Constructs an error object with property "code" set to "TERSE"', () => {
    const error = new TerseError();
    expect(error.code).toBe(TERSE);
    expect(error.message).toBe('');
  });

  it('Constructs an error object with property "code" set to "TERSE" with provided message', () => {
    const message = 'this is a message';
    const error = new TerseError(message);
    expect(error.code).toBe(TERSE);
    expect(error.message).toBe(message);
  });
});
