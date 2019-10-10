import redent = require('redent');

import { Command, AnyInput } from './types';
import { CLI_BRANCH, RED_ERROR } from './constants';
import { createTextList } from './create-text-list';
import { regularizeText, wrapInSquareBrackets } from './util';
import { getPathAndDescriptionOfLeaves } from './get-path-and-description-of-leaves';
import { LastCommand } from './last-command';
import { mapCommand } from './map-command';

const INDENT_SIZE = 3;

export function UsageString(rootCommand: Command, errorMessage?: string) {
  const lastCommand = LastCommand(rootCommand);

  const commandPathString = mapCommand(rootCommand, command => command.name).join(' ');
  let firstParagraph = `Usage: ${commandPathString}`;
  const otherParagraphs: string[] = [];

  function appendInputUsage(input?: AnyInput, prefix?: string) {
    if (input && !input.hidden) {
      const { placeholder, description, required } = input;
      if (prefix) {
        firstParagraph += ` ${prefix}`;
      }
      firstParagraph += ` ${required ? placeholder : wrapInSquareBrackets(placeholder)}`;
      if (description) {
        otherParagraphs.push(`${placeholder}:`);
        otherParagraphs.push(redent(regularizeText(description), INDENT_SIZE));
      }
    }
  }

  if (lastCommand.commandType === CLI_BRANCH) {
    // BRANCH
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
  } else {
    // LEAF
    const { positionalInput, namedInputs, escapedInput } = lastCommand;

    appendInputUsage(positionalInput);

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
            const text = input.description;
            return { name, text };
          },
        );
        const optionsParagraph = redent(createTextList(...items), INDENT_SIZE);
        otherParagraphs.push(optionsParagraph);
      }
    }

    appendInputUsage(escapedInput, '--');
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
