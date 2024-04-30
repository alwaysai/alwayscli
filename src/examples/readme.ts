import { CliLeaf } from '../cli-leaf';
import { CliNumberArrayInput } from '../cli-number-array-input';
import { CliFlagInput } from '../cli-flag-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const multiplyCliLeaf = CliLeaf({
  name: 'multiply',
  description: 'Multiply numbers and print the result',
  positionalInput: CliNumberArrayInput({ required: true }),
  namedInputs: {
    squared: CliFlagInput({
      description: 'Square the result before printing it'
    })
  },
  action(numbers, { squared }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squared) {
      return multiplied * multiplied;
    }
    return multiplied;
  }
});

if (require.main === module) {
  runCliAndExit(multiplyCliLeaf).catch(console.error);
}
