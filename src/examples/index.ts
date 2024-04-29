import { runCliAndExit, CliBranch } from '..';
import { echoCliLeaf as echo } from './echo';
import { multiplyCliLeaf as readme } from './readme';
import { root as throw_ } from './throw';

const pkg = require('../../package.json');

export const examples = CliBranch({
  name: 'examples',
  description: `Examples that demonstrate ${pkg.name} features`,
  subcommands: [echo, readme, throw_]
});

if (module === require.main) {
  runCliAndExit(examples);
}
