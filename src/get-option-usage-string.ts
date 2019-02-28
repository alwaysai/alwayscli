import { AnyOption } from './types';
import redent = require('redent');
import { regularizeDescription } from './util';

export function getOptionUsageString(optionName: string, option: AnyOption) {
  const { getDescription, placeholder } = option;
  const description = getDescription();
  const descriptionLines = description
    ? regularizeDescription(description).split('\n')
    : [];
  const optionUsage = `--${optionName} ${placeholder}`;
  let firstLine = optionUsage;
  const firstDescriptionLine = descriptionLines[0];
  if (firstDescriptionLine) {
    firstLine += ` : ${firstDescriptionLine}`;
  }
  const restDescriptionLines = descriptionLines.slice(1);
  const restLines =
    restDescriptionLines.length > 0
      ? redent(restDescriptionLines.join('\n'), optionUsage.length + 3).split('\n')
      : [];
  return [firstLine, ...restLines].join('\n');
}
