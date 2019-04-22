import { createCli, createBranch, createLeaf, runAndExit } from '..';

import { root as echoCommand } from './echo';

const hiddenEcho = createLeaf({
  ...echoCommand,
  name: 'hidden-echo',
  description: 'This command is a clone of "echo" but with "hidden" set to true',
  hidden: true,
});

export const root = createBranch({
  name: 'cli',
  description: `
    Non-hidden command "${echoCommand.name}" shows up in this usage documentation.
    Hidden subcommand "${hiddenEcho.name}" does not appear in the subcommands list.`,
  subcommands: [hiddenEcho, echoCommand],
});

export const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
