export const TERSE = 'TERSE';

export class TerseError extends Error {
  public readonly code: typeof TERSE;
  constructor(message?: string) {
    super(message);
    this.code = TERSE;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
