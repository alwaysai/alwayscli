export const CLI_TERSE_ERROR = 'CLI_TERSE_ERROR';

export class CliTerseError extends Error {
  public readonly code: typeof CLI_TERSE_ERROR;
  constructor(message: string) {
    super(message);
    this.code = CLI_TERSE_ERROR;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
