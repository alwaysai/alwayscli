import { UsageError } from './usage-error';

export function singleQuote(str: string) {
  return `'${str}'`;
}

export function regularizeDescription(str: string) {
  return str.replace(/^\n/, '');
}

export function convertToNumber(rawValue: string) {
  let value: number = NaN;
  if (rawValue.length > 0) {
    value = Number(rawValue);
  }
  if (isNaN(value)) {
    throw new UsageError(`"${rawValue}" is not a number`);
  }
  return value;
}
