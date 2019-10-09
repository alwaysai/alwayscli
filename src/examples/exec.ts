import { execSync } from 'child_process';
import { CliStringInput } from '../cli-string-input';
import { CliLeaf } from '../cli-leaf';
import { CliStringArrayInput } from '../cli-string-array-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const execCliLeaf = CliLeaf({
  name: 'exec',
  description: 'Run a shell command',
  namedInputs: {
    cwd: CliStringInput({
      placeholder: '<path>',
      description: 'Current working directory of the child process',
    }),
  },
  escapedInput: CliStringArrayInput({
    required: true,
    placeholder: '<command> [<arguments>]',
  }),
  action(_, { cwd }, escaped) {
    const command = escaped.join(' ');
    const output = execSync(command, { cwd, encoding: 'utf8' });
    return output;
  },
});

if (module === require.main) {
  runCliAndExit(execCliLeaf);
}
