import { createCli, createLeaf, createStringArrayInput, runAndExit } from '..';

// This is a single-action CLI that mimics the "echo" utility. Its root command
// is imported by a number of other examples in this directory.
export const root = createLeaf({
  name: 'echo',
  description: `
    Write arguments to standard output (stdout)
`,
  args: createStringArrayInput({ required: true }),
  action(messages) {
    const text = messages.join(' ');

    // Here we could `console.log(text)` to print the messages to the console.

    // But instead it's better to:
    return text;

    // alwaysCLI will automatically console.log the return value of the action.
    // This form is more idiomatic, composable, and easier to unit test!
  },
});

export const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
