export const TERSE = 'TERSE';

export class TerseError extends Error {
  public readonly code: typeof TERSE;
  constructor(message?: string) {
    super(message);
    this.code = TERSE;
    if (typeof this.stack === 'string') {
      this.stack = `${this.stack}\n`;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
