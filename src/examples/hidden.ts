import {
  createCli,
  createLeaf,
  createBranch,
  createFlagInput,
  createStringArrayInput,
  runAndExit,
} from '..';

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

const echo = createLeaf({
  name: 'echo',
  description: 'Print messages to the console',
  options: {
    pizza: createFlagInput({ hidden: true }),
  },
  args: createStringArrayInput({ required: true }),
  action(messages, { pizza }) {
    return pizza ? PIZZA_MESSAGE : messages.join(' ');
  },
});

const hiddenEcho = {
  ...echo,
  name: 'hidden',
  description: 'This command is hidden',
  hidden: true,
};

const secret = createBranch({
  name: 'secret',
  description: 'A secret branch',
  hidden: true,
  subcommands: [echo, hiddenEcho],
});

const root = createBranch({
  name: 'cli',
  description: 'A CLI with "hidden" inputs, branches, and leaves',
  subcommands: [secret, echo],
});

const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
