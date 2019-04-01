const HELP_ARGS = ['--help', '-h', 'help'];

export function accumulateNonHelpArgs(...args: string[]) {
  const nonHelpArgs: string[] = [];
  let foundHelp = false;
  for (const arg of args) {
    if (HELP_ARGS.includes(arg)) {
      foundHelp = true;
    } else {
      nonHelpArgs.push(arg);
    }
  }
  return {
    foundHelp,
    nonHelpArgs,
  };
}
