import { CliLeaf } from '../src/cli-leaf';
import { CliNumberArrayInput } from '../src/cli-number-array-input';
import { CliFlagInput } from '../src/cli-flag-input';
import { runCliAndExit } from '../src/run-cli-and-exit';

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
