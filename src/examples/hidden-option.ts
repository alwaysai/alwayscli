import { echoCliLeaf as echoCommand } from './echo';
import { CliLeaf } from '../cli-leaf';
import { CliFlagInput } from '../cli-flag-input';
import { runCliAndExit } from '../run-cli-and-exit';
import { basename } from 'path';

const PIZZA_MESSAGE = `
       _              
      (_)             
__ __  _ __________ _ 
| '_ \\| |_  /_  / _' |
| |_) | |/ / / / (_| |
| .__/|_/___/___\\__,_|
| |                   
|_|                   
`;

// All alwaysCLI abstractions are plain-old JavaScript objects and functions.
// This makes it easy to re-use bits of existing commands and/or inputs.
export const root = CliLeaf({
  ...echoCommand,
  description: `
    This CLI has a hidden named input "--pizza". If an option is "hidden", it does not 
    appear in the command's usage documentation. Hidden inputs might be "easter eggs" 
    like in this example or experimental features, for example.
    For this CLI, you can see usage for the hidden inputs by setting SHOW_HIDDEN
    in your environment, e.g.
      SHOW_HIDDEN=1 ${basename(process.argv[0])} ${basename(process.argv[1])}
`,
  namedInputs: { pizza: CliFlagInput({ hidden: true }) },
  action(messages, { pizza }, escaped) {
    if (pizza) {
      return PIZZA_MESSAGE;
    }
    return echoCommand.action(messages, {}, escaped);
  },
});

if (module === require.main) {
  runCliAndExit(root, { showHidden: Boolean(process.env.SHOW_HIDDEN) });
}
