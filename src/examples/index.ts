import { createCli, runAndExit, createBranch } from '..';
import { root as echo } from './echo';
import { root as readme } from './readme';
import { root as throw_ } from './throw';

const pkg = require('../../package.json');

export const examples = createBranch({
  name: 'examples',
  description: `Examples that demonstrate ${pkg.name} features`,
  subcommands: [echo, readme, throw_],
});

if (module === require.main) {
  const cli = createCli(examples);
  runAndExit(cli, ...process.argv.slice(2));
}
