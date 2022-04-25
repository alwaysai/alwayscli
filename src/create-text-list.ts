import { regularizeText } from './util';

type Item = {
  name: string;
  text?: string;
};

function createTextListParagraph(item: Item, targetNameLength: number = 0) {
  const { name, text } = item;
  const lines = regularizeText(text).split('\n');
  const paddedName = name.padEnd(targetNameLength);
  let firstLine = paddedName;
  if (lines[0]) {
    firstLine += ` : ${lines[0]}`;
  }
  const padding = ''.padEnd(targetNameLength + 3);
  const paddedLines = lines.slice(1).map((line) => `${padding}${line}`);
  return [firstLine, ...paddedLines].join('\n');
}

export function createTextList(...items: Item[]) {
  const targetNameLength = Math.max(...items.map(({ name }) => name.length));
  const paragraphs = items.map((item) => createTextListParagraph(item, targetNameLength));
  return paragraphs.join('\n');
}
