import { CliLeaf } from '../cli-leaf';
import { CliStringArrayInput } from '../cli-string-array-input';
import { runCliAndExit } from '../run-cli-and-exit';

// This is a single-action CLI that mimics the "echo" utility. Its root command
// is imported by a number of other examples in this directory.
export const echoCliLeaf = CliLeaf({
  name: 'echo',
  description: `
    Write arguments to standard output (stdout)
`,
  positionalInput: CliStringArrayInput({ required: true }),
  action(messages) {
    const text = messages.join(' ');
    return text;
  }
});

if (module === require.main) {
  runCliAndExit(echoCliLeaf);
}
