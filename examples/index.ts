import { runCliAndExit, CliBranch } from '../src/index';
import { echoCliLeaf as echo } from './echo';
import { multiplyCliLeaf as readme } from './readme';
import { root as throw_ } from './throw';
import { name as packageName } from '../package.json';

export const examples = CliBranch({
  name: 'examples',
  description: `Examples that demonstrate ${packageName} features`,
  subcommands: [echo, readme, throw_]
});

if (module === require.main) {
  runCliAndExit(examples).catch(console.error);
}
