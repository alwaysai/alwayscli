# @alwaysai/always-cli [![Build Status](https://travis-ci.com/alwaysai/always-cli.svg?branch=master)](https://travis-ci.com/alwaysai/always-cli)

A library for building Node.js command-line interfaces (CLIs). This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

Here is an example of a Node.js CLI written in TypeScript:

```ts
import {
  createLeaf,
  createStringOption,
  createBranch,
  createNumberArrayOption,
  createFlagOption,
  createCommandLineInterface,
  makeOptionRequired,
  UsageError,
} from '@alwaysai/always-cli';

import { promisify } from 'util';
import { readFile } from 'fs';
import { isAbsolute } from 'path';

// A "leaf" command defines an "action" function
export const multiply = createLeaf({
  commandName: 'multiply',
  description: 'Multiply numbers',
  options: {
    numbers: makeOptionRequired(createNumberArrayOption()),
    squareTheResult: createFlagOption(),
  },
  action({ numbers, squareTheResult }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squareTheResult) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

export const cat = createLeaf({
  commandName: 'cat',
  description: 'Print the contents of a file',
  options: {
    filePath: makeOptionRequired(
      createStringOption({
        description: 'An absolute path',
      }),
    ),
  },
  async action({ filePath }) {
    if (!isAbsolute(filePath)) {
      throw new UsageError('filePath must be absolute');
    }
    const contents = await promisify(readFile)(filePath, { encoding: 'utf8' });
    return contents;
  },
});

// A "branch" command is a container for subcommands which can
// themselves be either "branch" commands or "leaf" commands
export const root = createBranch({
  commandName: 'readme-cli',
  description: `
    This is an example command-line interface (CLI).
    Its only purpose is to demonstrate features.`,
  subcommands: [multiply, cat],
});

const commandLineInterface = createCommandLineInterface(root);

if (require.main === module) {
  commandLineInterface();
}
```
The `commandLineInterface()` statement near the end is the one that does the heavy lifting of parsing the command-line arguments and running the appropriate command. It's wrapped in the `require.main === module` conditional so that it will only be called [if this file has been run directly](https://nodejs.org/api/modules.html). That makes it easier to unit test the exported leaf commands separately.

Here's how that behaves as a CLI. If no arguments are passed, it prints the top-level usage:
```
$ readme-cli
Usage: readme-cli <subcommand> <options>

   This is an example command-line interface (CLI).
   Its only purpose is to demonstrate features.

Subcommands:

   multiply, cat
```
The usage of a `@alwaysai/always-cli` CLI is always:
```
<program> [<subcommand0> ...] [--option0 <val0> ...] [...]
```
The CLI arguments up to the first one starting with `--` are command/subcommand names. Starting with the first `--` argument, all remaining arguments are either option names or option values.

If a subcommand is invoked without its required arguments, the CLI prints usage for the subcommand:
```
$ readme-cli multiply
Error: option "numbers" is required

Usage: readme-cli multiply <options>

   Multiply numbers

Options:

   --numbers <num0> [...]
   --squareTheResult
```
Here is an example of successful invocation of a command with a synchronous `action`:
```
$ readme-cli multiply --numbers 1 2 3 --squareTheResult
36
```
All `flag` options default to `false` and can be enabled (set to `true`) as in the example above.

Here's an example of a command with an asynchronous `action` and an option with a `defaultValue`:
```
$ readme-cli cat $(pwd)/readme-cli.ts
import {
  createLeaf,
  createStringOption,
...
```
## API
### createLeaf({commandName, description?, options?, action})
A factory for creating commands that comprise a CLI. It returns the passed object with an additional property `commandType` set to a unique identifier. The `commandType` property is used internally to discriminate between "leaf" and "branch" commands. See the [advanced TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html) for more information on discriminated unions.

#### commandName
If this "leaf" is a subcommand, `commandName` is the string that the user will pass as the "subcommand" argument to invoke this action. If this "leaf" is the root command (i.e. the thing passed into `cli`), `commandName` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### options 
(Optional) An object whose keys option names and whose values are created by the `option` factory, for example:
```ts
const options = {
  filePath: createStringOption({
    description: 'An absolute or relative path',
  }),
}
```
The `options` property is used to derive the type of the `namedArgs` passed into the `action` function. In this example, `namedArgs` would look like
```ts
{ filePath: string | undefined }
```

#### action
A function that defines your command logic. `action` can return a value synchronously like in the "multiply" example above, or it can be an `async` function that returns a `Promise` like in the `cat` example. If `action` returns/resolves a value, that value is `console.log`ged before the CLI exits. If `action` throws/rejects, the exception is `console.log`ged before the CLI exits. That means that if you don't want the user to see a stack trace, your `action` should throw a `string` instead of an `Error` object.

### createBranch({commandName, description, subcommands})
A factory function similar to `createLeaf`. Returns the passed object with an additional property `commandType` set to a unique identifier.

#### commandName
If this "branch" is not the root command, `commandName` is the string that the user will pass as the "subcommand" argument to invoke actions in this part of the command tree. If this "branch" command is the root command, `commandName` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### subcommands
An array of `branch` and/or `leaf` objects.

### createCommandLineInterface(root): asyncFunc
Returns a function that invokes an `action`, `console.log`s the result, and exits

#### root
A `leaf` or `branch`

#### asyncFunc
`(argv?) => Promise<void>`: Typically `cli` and the function it returns are invoked all in one line as `cli(root)()`.

##### argv
(Optional) A `string[]` array of command-line arguments. Defaults to `process.argv.slice(2)`.

### createCommandInterface(root)
The function `createCommandLineInterface` just calls `runAndExit` on the thing returned by `createCommandInterface`.

## More information
This library has a couple dozen unit tests with >90% coverage. If you want to see more examples of how things works, check out the `.test.ts` files in the [src](src) directory. Also check out [src/examples](src/examples). If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on this project's repository on GitHub.

## License

MIT © [alwaysAI, Inc.](https://alwaysai.co)
