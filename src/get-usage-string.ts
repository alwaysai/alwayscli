import redent = require('redent');

import { Command } from './types';
import { BRANCH, LEAF } from './constants';
import { getOptionString } from './get-option-string';

const indent = (strings: string[]) => redent(strings.join('\n'), 3);

export function getUsageString(commandStack: Command[], errorMessage?: string) {
  const command = commandStack.slice(-1)[0];
  // ^^ Last command on the stack

  const errorParagraphs = errorMessage ? [`Error: ${errorMessage}`] : [];

  let usageParagraph = `Usage: ${commandStack
    .map(command => command.commandName)
    .join(' ')}`;

  const leadingNewlineRegExp = /^\r?\n/;
  const descriptionParagraphs = command.description
    ? [redent(command.description.replace(leadingNewlineRegExp, ''), 3)]
    : [];

  const finalParagraphs: string[] = [];
  switch (command.commandType) {
    case BRANCH:
      usageParagraph += ' <subcommand> <options>';
      finalParagraphs.push('Subcommands:');
      finalParagraphs.push(
        indent([command.subcommands.map(command => command.commandName).join(', ')]),
      );
      break;
    case LEAF:
      if (command.options) {
        const entries = Object.entries(command.options);
        if (entries.length > 0) {
          usageParagraph += ' <options>';
          finalParagraphs.push('Options:');
          finalParagraphs.push(indent(entries.map(pair => getOptionString(...pair))));
        }
      }
      break;
    default:
      throw new Error('Unexpected command type');
  }

  const paragraphs = [
    usageParagraph,
    ...descriptionParagraphs,
    ...finalParagraphs,
    ...errorParagraphs,
  ];

  return `${paragraphs.join('\n\n')}\n`;
}
