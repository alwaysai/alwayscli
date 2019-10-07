export const USAGE = 'USAGE';

export class UsageError extends Error {
  public readonly code: typeof USAGE;
  constructor(message?: string) {
    super(message);
    this.code = USAGE;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
