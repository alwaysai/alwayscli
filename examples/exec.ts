import { execSync } from 'child_process';
import { CliStringInput } from '../src/cli-string-input';
import { CliLeaf } from '../src/cli-leaf';
import { CliStringArrayInput } from '../src/cli-string-array-input';
import { runCliAndExit } from '../src/run-cli-and-exit';

export const execCliLeaf = CliLeaf({
  name: 'exec',
  description: 'Run a shell command',
  namedInputs: {
    cwd: CliStringInput({
      placeholder: '<path>',
      description: 'Current working directory of the child process'
    })
  },
  escapedInput: CliStringArrayInput({
    required: true,
    placeholder: '<command> [<arguments>]'
  }),
  async action(_, { cwd }, escaped) {
    const command = escaped.join(' ');
    try {
      const output = execSync(command, { cwd, encoding: 'utf8' });
      return output;
    } catch (error) {
      console.error(error);
      return '';
    }
  }
});

if (module === require.main) {
  runCliAndExit(execCliLeaf).catch(console.error);
}
