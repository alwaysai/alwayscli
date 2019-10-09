import { execSync } from 'child_process';
import { createStringInput } from '../input-factories/create-string-input';
import { CliLeaf } from '../cli-leaf';
import { createStringArrayInput } from '../input-factories/create-string-array-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const execCliLeaf = CliLeaf({
  name: 'exec',
  description: 'Run a shell command',
  options: {
    cwd: createStringInput({
      placeholder: '<path>',
      description: 'Current working directory of the child process',
    }),
  },
  escaped: createStringArrayInput({
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
