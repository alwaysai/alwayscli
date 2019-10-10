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
    Hidden subcommand "${hiddenEcho.name}" does not appear in the subcommands list.`,
  subcommands: [hiddenEcho, echoCommand],
});

if (module === require.main) {
  runCliAndExit(root);
}
