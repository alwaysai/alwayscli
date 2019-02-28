export class UsageError extends Error {
  public readonly code: 'USAGE';
  constructor(message?: string) {
    super(message);
    this.code = 'USAGE';
    if (typeof this.stack === 'string') {
      this.stack = `${this.stack}\n`;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
