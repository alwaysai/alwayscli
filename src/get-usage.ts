import redent = require('redent');
import chalk from 'chalk';

import { Command } from './types';
import { BRANCH, LEAF } from './constants';
import { createTextList } from './create-text-list';

const INDENT_SIZE = 3;

const RED_ERROR = chalk.red('Error:');

export function getUsage(commands: Command[], errorMessage?: string) {
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
      const items: Parameters<typeof createTextList> = command.subcommands.map(
        ({ commandName, description }) => ({ name: commandName, text: description }),
      );
      const subcommandsParagraph = redent(createTextList(...items), INDENT_SIZE);
      finalParagraphs.push(subcommandsParagraph);
      break;
    case LEAF:
      if (command.namedInputs) {
        const entries = Object.entries(command.namedInputs);
        if (entries.length > 0) {
          usageParagraph += ' <options>';
          finalParagraphs.push('Options:');
          const items: Parameters<typeof createTextList> = entries.map(
            ([inputName, input]) => {
              let name = `--${inputName}`;
              if (input.placeholder) {
                name += ` ${input.placeholder}`;
              }
              const text = input.getDescription && input.getDescription();
              return { name, text };
            },
          );
          const options = redent(createTextList(...items), INDENT_SIZE);
          finalParagraphs.push(options);
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
