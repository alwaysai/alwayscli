import redent = require('redent');

import { Command } from './types';
import { BRANCH, LEAF, RED_ERROR } from './constants';
import { createTextList } from './create-text-list';
import { regularizeText, wrapInSquareBrackets } from './util';
import { getPathAndDescriptionOfLeaves } from './get-path-and-description-of-leaves';

const INDENT_SIZE = 3;

export function getUsage(commands: Command[], errorMessage?: string) {
  const command = commands.slice(-1)[0];
  // ^^ Last command on the stack. Could be leaf or branch.

  let firstParagraph = `Usage: ${commands.map(command => command.name).join(' ')}`;

  const otherParagraphs: string[] = [];
  switch (command._type) {
    case BRANCH:
      firstParagraph += ' <subcommand> ...';
      otherParagraphs.push('Subcommands:');
      const nameAndDescriptionOfLeaves = getPathAndDescriptionOfLeaves(command, []);
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
      const { args: positionalInput, options: namedInputs } = command;
      if (positionalInput && !positionalInput.hidden) {
        const { placeholder, getDescription, required } = positionalInput;
        firstParagraph += ` ${
          required ? placeholder : wrapInSquareBrackets(placeholder)
        }`;
        const description = getDescription && getDescription();
        if (description) {
          otherParagraphs.push(`${placeholder}:`);
          otherParagraphs.push(redent(regularizeText(description), INDENT_SIZE));
        }
      }
      if (namedInputs) {
        const entries = Object.entries(namedInputs).filter(([_, input]) => !input.hidden);
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
      break;
    default:
      throw new Error('Unexpected command type');
  }

  const paragraphs = [firstParagraph];

  const regularizedDescription = regularizeText(command.description);
  if (regularizedDescription) {
    paragraphs.push(redent(regularizedDescription, INDENT_SIZE));
  }

  paragraphs.push(...otherParagraphs);

  if (errorMessage) {
    paragraphs.push(`${RED_ERROR} ${errorMessage}`);
  }

  return paragraphs.join('\n\n');
}
