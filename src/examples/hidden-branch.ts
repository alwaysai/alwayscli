import { createCli, createBranch, runAndExit } from '..';

import { root as echoCommand } from './echo';

const nonHiddenBranch = createBranch({
  name: 'non-hidden',
  description: `
    This is a normal non-hidden command branch.
    Its "description" shows up in command usage docs.`,
  subcommands: [echoCommand],
});

const hiddenBranch = createBranch({
  name: 'secret',
  description: `
    This is a command branch that has hidden=true.
    It does not show up in the list of "subcommands",
    but it is otherwise fully functional.`,
  hidden: true,
  subcommands: [echoCommand],
});

export const root = createBranch({
  name: 'cli',
  description: 'This CLI has a "hidden" command branch called "secret".',
  subcommands: [nonHiddenBranch, hiddenBranch],
});

export const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
