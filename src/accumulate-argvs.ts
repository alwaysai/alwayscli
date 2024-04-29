export type NamedArgvs = {
  [argName: string]: string[] | undefined;
};

const DASH_DASH = '--';
const HELP_ARGS = ['--help', '-h', 'help'];

export function accumulateArgvs(argv: string[]) {
  const commandNamesAndPositionalArgv: string[] = [];
  const namedArgvs: NamedArgvs = {};
  let escapedArgv: string[] | undefined = undefined;
  let foundHelp = false;
  let currentArgv = commandNamesAndPositionalArgv;
  for (let i = 0; i < argv.length; i = i + 1) {
    const str = argv[i];

    if (HELP_ARGS.includes(str)) {
      foundHelp = true;
      continue;
    }

    if (str === DASH_DASH) {
      escapedArgv = argv.slice(i + 1);
      break;
    }

    if (str.startsWith(DASH_DASH)) {
      const name = str.slice(DASH_DASH.length).trim();
      const namedArgv = namedArgvs[name];
      if (namedArgv) {
        // Allow user to supply multi-valued argvs as, e.g.
        // --foo bar --foo baz
        // is equivalent to
        // --foo bar baz
        currentArgv = namedArgv;
      } else {
        currentArgv = [];
        namedArgvs[name] = currentArgv;
      }
      continue;
    }

    // This str is not "--"
    // nor have we hit "--"
    // nor is this str "--something"
    currentArgv.push(str);
  }

  return {
    foundHelp,
    commandNamesAndPositionalArgv,
    namedArgvs,
    escapedArgv
  };
}
