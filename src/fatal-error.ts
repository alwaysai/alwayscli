export const FATAL = 'FATAL';

export class FatalError extends Error {
  public readonly code: 'FATAL';
  constructor(message?: string) {
    super(message);
    this.code = 'FATAL';
    if (typeof this.stack === 'string') {
      this.stack = `${this.stack}\n`;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
