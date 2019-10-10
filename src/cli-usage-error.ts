export const CLI_USAGE_ERROR = 'CLI_USAGE_ERROR';

export class CliUsageError extends Error {
  public readonly code: typeof CLI_USAGE_ERROR;
  constructor(message?: string) {
    super(message);
    this.code = CLI_USAGE_ERROR;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
