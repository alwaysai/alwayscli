import { AnyInput } from './types';
import redent = require('redent');
import { regularizeDescription, wrapInSquareBrackets } from './util';

export function getNamedInputUsageString(inputName: string, input: AnyInput) {
  const { getDescription, placeholder, required } = input;
  const description = getDescription && getDescription();
  const descriptionLines = description
    ? regularizeDescription(description).split('\n')
    : [];
  let syntax = `--${inputName}`;
  if (placeholder) {
    syntax += ` ${placeholder}`;
  }
  if (!required) {
    syntax = wrapInSquareBrackets(syntax);
  }
  let firstLine = syntax;
  const firstDescriptionLine = descriptionLines[0];
  if (firstDescriptionLine) {
    firstLine += ` : ${firstDescriptionLine}`;
  }
  const restDescriptionLines = descriptionLines.slice(1);
  const restLines =
    restDescriptionLines.length > 0
      ? redent(restDescriptionLines.join('\n'), syntax.length + 3).split('\n')
      : [];
  return [firstLine, ...restLines].join('\n');
}
