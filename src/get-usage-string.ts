import redent = require('redent');
import chalk from 'chalk';

import { Command } from './types';
import { BRANCH, LEAF } from './constants';
import { getNamedInputUsageString } from './get-named-input-usage-string';

const indent = (strings: string[]) => redent(strings.join('\n'), 3);

const RED_ERROR = chalk.red('Error:');

export function getUsageString(commands: Command[], errorMessage?: string) {
  const command = commands.slice(-1)[0];
  // ^^ Last command on the stack

  const errorParagraphs = errorMessage ? [`${RED_ERROR} ${errorMessage}`] : [];

  let usageParagraph = `Usage: ${commands.map(command => command.commandName).join(' ')}`;

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
      if (command.namedInputs) {
        const entries = Object.entries(command.namedInputs);
        if (entries.length > 0) {
          usageParagraph += ' <options>';
          finalParagraphs.push('Options:');
          finalParagraphs.push(
            indent(entries.map(pair => getNamedInputUsageString(...pair))),
          );
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
