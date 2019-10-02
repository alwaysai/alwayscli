export type OptionsArgvObject = {
  [argName: string]: string[] | undefined;
};

const DASH_DASH = '--';
const HELP_ARGS = ['--help', '-h', 'help'];

export function accumulateArgvObject(...argv: string[]) {
  const commandNameAndArgsArgv: string[] = [];
  const optionsArgvObject: OptionsArgvObject = {};
  let escapedArgv: string[] | undefined = undefined;
  let foundHelp = false;
  let currentArgv = commandNameAndArgsArgv;
  for (const str of argv) {
    if (escapedArgv) {
      // We've already hit a lone "--"
      escapedArgv.push(str);
    } else if (HELP_ARGS.includes(str)) {
      foundHelp = true;
    } else {
      if (str === DASH_DASH) {
        escapedArgv = [];
      } else if (str.startsWith(DASH_DASH)) {
        const name = str.slice(DASH_DASH.length).trim();
        const existingNamedArgv = optionsArgvObject[name];
        if (existingNamedArgv) {
          // Allows user to supply multi-valued argvs as, e.g.
          // --foo bar --foo baz
          // is equivalent to
          // --foo bar baz
          currentArgv = existingNamedArgv;
        } else {
          currentArgv = [];
          optionsArgvObject[name] = currentArgv;
        }
      } else {
        // This str is not "--"
        // nor have we hit "--"
        // nor is this str "--something"
        currentArgv.push(str);
      }
    }
  }
  return {
    foundHelp,
    commandNameAndArgsArgv,
    optionsArgvObject,
    escapedArgv,
  };
}
