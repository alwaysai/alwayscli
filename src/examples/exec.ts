import { createCli, createLeaf, createStringArrayInput, runAndExit } from '..';
import { execSync } from 'child_process';
import { createStringInput } from '../input-factories/create-string-input';

export const root = createLeaf({
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

export const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
