const HELP_ARGS = ['--help', '-h', 'help'];

export function accumulateNonHelpArgv(...argv: string[]) {
  const nonHelpArgv: string[] = [];
  let foundHelp = false;
  for (const arg of argv) {
    if (HELP_ARGS.includes(arg)) {
      foundHelp = true;
    } else {
      nonHelpArgv.push(arg);
    }
  }
  return {
    foundHelp,
    nonHelpArgv,
  };
}
