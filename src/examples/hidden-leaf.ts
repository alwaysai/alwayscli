import { basename } from 'path';
import { echoCliLeaf as echoCommand } from './echo';
import { CliLeaf } from '../cli-leaf';
import { CliBranch } from '../cli-branch';
import { runCliAndExit } from '../run-cli-and-exit';

const hiddenEcho = CliLeaf({
  ...echoCommand,
  name: 'hidden-echo',
  description: 'This command is a clone of "echo" but with "hidden" set to true',
  hidden: true,
});

export const root = CliBranch({
  name: 'cli',
  description: `
    Non-hidden command "${echoCommand.name}" shows up in this usage documentation.
    Hidden subcommand "${hiddenEcho.name}" does not appear in the subcommands list.
    For this CLI, you can see usage for the hidden inputs by setting SHOW_HIDDEN
    in your environment, e.g.
      SHOW_HIDDEN=1 ${basename(process.argv[0])} ${basename(process.argv[1])}
    `,
  subcommands: [hiddenEcho, echoCommand],
});

if (module === require.main) {
  runCliAndExit(root, { showHidden: Boolean(process.env.SHOW_HIDDEN) });
}
