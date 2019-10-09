import { echoCliLeaf as echoCommand } from './echo';
import { CliBranch } from '../cli-branch';
import { runCliAndExit } from '../run-cli-and-exit';

const nonHiddenCliBranch = CliBranch({
  name: 'non-hidden',
  description: `
    This is a normal non-hidden command branch.
    Its "description" shows up in command usage docs.`,
  subcommands: [echoCommand],
});

const hiddenCliBranch = CliBranch({
  name: 'secret',
  description: `
    This is a command branch that has hidden=true.
    It does not show up in the list of "subcommands",
    but it is otherwise fully functional.`,
  hidden: true,
  subcommands: [echoCommand],
});

export const root = CliBranch({
  name: 'cli',
  description: 'This CLI has a "hidden" command branch called "secret".',
  subcommands: [nonHiddenCliBranch, hiddenCliBranch],
});

if (module === require.main) {
  runCliAndExit(root);
}
