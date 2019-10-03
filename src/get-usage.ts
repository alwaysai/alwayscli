import redent = require('redent');

import { Command, AnyInput } from './types';
import { BRANCH, LEAF, RED_ERROR } from './constants';
import { createTextList } from './create-text-list';
import { regularizeText, wrapInSquareBrackets } from './util';
import { getPathAndDescriptionOfLeaves } from './get-path-and-description-of-leaves';
import { LastCommand } from './last-command';
import { mapCommand } from './map-command';

const INDENT_SIZE = 3;

export function getUsage(rootCommand: Command, errorMessage?: string) {
  const lastCommand = LastCommand(rootCommand);

  const commandPathString = mapCommand(rootCommand, command => command.name).join(' ');
  let firstParagraph = `Usage: ${commandPathString}`;
  const otherParagraphs: string[] = [];

  function appendInputUsage(input?: AnyInput, prefix?: string) {
    if (input && !input.hidden) {
      const { placeholder, getDescription, required } = input;
      if (prefix) {
        firstParagraph += ` ${prefix}`;
      }
      firstParagraph += ` ${required ? placeholder : wrapInSquareBrackets(placeholder)}`;
      const description = getDescription && getDescription();
      if (description) {
        otherParagraphs.push(`${placeholder}:`);
        otherParagraphs.push(redent(regularizeText(description), INDENT_SIZE));
      }
    }
  }

  switch (lastCommand._type) {
    case BRANCH:
      firstParagraph += ' <subcommand> ...';
      otherParagraphs.push('Subcommands:');
      const nameAndDescriptionOfLeaves = getPathAndDescriptionOfLeaves(lastCommand, []);
      const items: Parameters<typeof createTextList> = nameAndDescriptionOfLeaves.map(
        ({ path, description }) => ({
          name: path.join(' '),
          text: description,
        }),
      );
      const subcommandsParagraph = redent(createTextList(...items), INDENT_SIZE);
      otherParagraphs.push(subcommandsParagraph);
      break;
    case LEAF:
      const { args, options, escaped } = lastCommand;

      appendInputUsage(args);

      if (options) {
        const entries = Object.entries(options).filter(([_, input]) => !input.hidden);
        if (entries.length > 0) {
          const optionsNotRequired = entries.every(
            ([_, namedInput]) => !namedInput.required,
          );
          firstParagraph += optionsNotRequired ? ' [<options>]' : ' <options>';
          otherParagraphs.push('Options:');
          const items: Parameters<typeof createTextList> = entries.map(
            ([inputName, input]) => {
              let name = `--${inputName}`;
              if (input.placeholder) {
                name += ` ${input.placeholder}`;
              }
              if (!input.required) {
                name = wrapInSquareBrackets(name);
              }
              const text = input.getDescription && input.getDescription();
              return { name, text };
            },
          );
          const optionsParagraph = redent(createTextList(...items), INDENT_SIZE);
          otherParagraphs.push(optionsParagraph);
        }
      }

      appendInputUsage(escaped, '--');
      break;
    default:
      throw new Error('Unexpected command type');
  }

  const paragraphs = [firstParagraph];

  const regularizedDescription = regularizeText(lastCommand.description);
  if (regularizedDescription) {
    paragraphs.push(redent(regularizedDescription, INDENT_SIZE));
  }

  paragraphs.push(...otherParagraphs);

  if (errorMessage) {
    paragraphs.push(`${RED_ERROR} ${errorMessage}`);
  }

  return paragraphs.join('\n\n');
}
