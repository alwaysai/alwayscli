import { CliLeaf } from '../cli-leaf';
import { createNumberArrayInput } from '../input-factories/create-number-array-input';
import { CliFlagInput } from '../input-factories/cli-flag-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const multiplyCliLeaf = CliLeaf({
  name: 'multiply',
  description: 'Multiply numbers and print the result',
  args: createNumberArrayInput({ required: true }),
  options: {
    squared: CliFlagInput({
      description: 'Square the result before printing it',
    }),
  },
  action(numbers, { squared }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squared) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

if (require.main === module) {
  runCliAndExit(multiplyCliLeaf);
}
