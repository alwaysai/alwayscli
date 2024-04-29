import { CliUsageError } from './cli-usage-error';
import redent = require('redent');

export function wrapInSquareBrackets(str: string) {
  return `[${str}]`;
}

export function wrapInCurlyBrackets(str: string) {
  return `{${str}}`;
}

export function regularizeText(text?: string) {
  if (!text) {
    return '';
  }
  const trailingCarriageReturnRegExp = /\r$/;
  const lines = text
    .split('\n')
    .map((line) => line.replace(trailingCarriageReturnRegExp, ''));
  const regularizedLines: string[] = [];
  for (const line of lines) {
    if (regularizedLines.length > 0 || line.trim().length > 0) {
      // ^^ Effectively this trims leading lines that are only whitespace
      // ^^ This is to support multi-line descriptions supplied as:
      // const foo = {
      //   description: `
      //     A line
      //     Another line
      //   `,
      // };
      regularizedLines.push(line);
    }
  }
  const regularized = redent(regularizedLines.join('\n'), 0).trimRight();
  return regularized;
}

export function convertToNumber(rawValue: string) {
  let value = NaN;
  if (rawValue.length > 0) {
    value = Number(rawValue);
  }
  if (isNaN(value)) {
    throw new CliUsageError(`"${rawValue}" is not a number`);
  }
  return value;
}
