# @alwaysai/always-cli [![npm version](https://badge.fury.io/js/%40alwaysai%2Fcli.svg)](https://badge.fury.io/js/%40alwaysai%2Fcli) [![Build Status](https://travis-ci.com/alwaysai/always-cli.svg?branch=master)](https://travis-ci.com/alwaysai/always-cli)

A library for building Node.js command-line interfaces (CLIs). This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

Here is an example of a Node.js CLI written in TypeScript:

```ts
import { option, leaf, branch, cli } from '@alwaysai/always-cli';
import { promisify } from 'util';
import { readFile } from 'fs';
import { isAbsolute } = from 'path';

// A "leaf" command defines an "action" function
export const multiply = leaf({
  commandName: 'multiply',
  description: 'Multiply numbers',
  options: {
    numbers: option({
      typeName: 'number[]',
      nullable: false,
    }),
    squareTheResult: option({
      typeName: 'boolean',
      nullable: false,
    }),
  },
  action({ numbers, squareTheResult }) {
    const multiplied = numbers.reduce((a, b) => a * b, 1);
    if (squareTheResult) {
      return multiplied * multiplied;
    }
    return multiplied;
  }
});

export const cat = leaf({
  commandName: 'cat',
  description: 'Print the contents of a file',
  options: {
    filePath: option({
      typeName: 'string',
      nullable: false,
      description: 'An absolute path',
      defaultValue: __filename,
      validate(value) {
        if (isAbsolute(value)) {
          return;
        }
        return 'File path must be absolute'
      }
    }),
  },
  async action({ filePath }) {
    const contents = await promisify(readFile)(filePath, { encoding: 'utf8' });
    return contents;
  },
});

// A "branch" command is a container for subcommands which can
// themselves be either "branch" commands or "leaf" commands
export const root = branch({
  commandName: 'readme-cli',
  description: `
    This is an example command-line interface (CLI).
    Its only purpose is to demonstrate features.`,
  subcommands: [multiply, cat],
});

if (require.main === module) {
  cli(root)();
}
```
The `cli(root)` statement near the end is the one that does the heavy lifting of parsing the command-line arguments and running the appropriate command. It's wrapped in the `require.main === module` conditional so that it will only be called [if this file has been run directly](https://nodejs.org/api/modules.html). That makes it easier to unit test the exported leaf commands separately.

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

   --numbers <num0> [<num1> ...]
   --squareTheResult
```
Here is an example of successful invocation of a command with a synchronous `action`:
```
$ readme-cli multiply --numbers 1 2 3 --squareTheResult
36
```
All `boolean` options default to `false` and can be enabled (set to `true`) as in the example above.

Here's an example of a command with an asynchronous `action` and an option with a `defaultValue`:
```
$ readme-cli read-file
const { option, leaf, branch, cli } = require('@alwaysai/always-cli');
const { promisify } = require('util');
...
```
## API
### option({typeName, nullable, description?, defaultValue?, allowedValues?, validate?})
A factory function for CLI parameters. Returns the passed object.

#### typeName
`'string' | 'string[]' | 'boolean' | 'number' | 'number[]' | 'json'`

#### nullable
`boolean`. If `true`, `null` will be supplied to `action` if this option has neither a default value nor has a value been passed. If `false`, all options must have a default value or be passed as an argument.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### defaultValue
(Optional) A value consistent with `typeName`. For example:
```ts
// OK
const okOption = option({
  typeName: 'number',
  defaultValue: 3,
})
```
TypeScript would complain though if you tried to do this:
```ts
// NOT OK
const notOkOption = option({
  typeName: 'number',
  defaultValue: 'foo',
  // ^^ Type 'string' is not assignable to type 'number | undefined'
})
```

#### allowedValues
(Optional) Only available for `typeName = 'string' | 'number'`. An array of values that are valid for this option. If any other value is supplied, the CLI prints an error message and usage text. Currently the TypeScript type of named argument passed to `action` is not constrained by `allowedValues`.

#### validate
(Optional) `(value) => Promise<string | undefined> | string | undefined`. This function receives the parsed value of the option and must return a `string` or `undefined` or a `Promise` that resolves to a `string` or `undefined`. If the returned/resolved value is a string, it's printed to the console as an error message along with the proper usage for that command.

### leaf({commandName, description?, options?, action})
A factory for creating commands that comprise a CLI. It returns the passed object with an additional property `commandType` set to a unique identifier. The `commandType` property is used internally to discriminate between "leaf" and "branch" commands. See the [advanced TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html) for more information on discriminated unions.

#### commandName
If this "leaf" is a subcommand, `commandName` is the string that the user will pass as the "subcommand" argument to invoke this action. If this "leaf" is the root command (i.e. the thing passed into `cli`), `commandName` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### options 
(Optional) An object whose keys option names and whose values are created by the `option` factory, for example:
```ts
const options = {
  filePath: option({
    typeName: 'string',
    description: 'An absolute or relative path',
  }),
}
```
The `options` property is used to derive the type of the `namedArgs` passed into the `action` function. In this example, `namedArgs` would look like
```ts
{ filePath: string }
```

The value of a `'json'` option is a string that gets parsed using `JSON.parse` when included in the `namedArgs`.

#### action
A function that defines your command logic. `action` can return a value synchronously like in the "multiply" example above, or it can be an `async` function that returns a `Promise` like in the `catCommand` example. If `action` returns/resolves a value, that value is `console.log`ged before the CLI exits. If `action` throws/rejects, the exception is `console.log`ged before the CLI exits. That means that if you don't want the user to see a stack trace, your `action` should throw a `string` instead of an `Error` object.

### branch({commandName, description, subcommands})
A factory function similar to `leaf`. Returns the passed object with an additional property `commandType` set to a unique identifier.

#### commandName
If this "branch" is not the root command, `commandName` is the string that the user will pass as the "subcommand" argument to invoke actions in this part of the command tree. If this "branch" command is the root command, `commandName` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### subcommands
An array of `branch` and/or `leaf` objects.

### cli(root): asyncFunc
Returns a function that invokes an `action`, `console.log`s the result, and exits

#### root
A `leaf` or `branch`

#### asyncFunc
`(argv?) => Promise<void>`: Typically `cli` and the function it returns are invoked all in one line as `cli(root)()`.

##### argv
(Optional) A `string[]` array of command-line arguments. Defaults to `process.argv.slice(2)`.

### testCli(command)
The body of the `cli` function described above is a single statement:
```ts
runAndExit(assembleCli(rootCommand), argv);
```
`assembleCli` is exported separately to make it easier for users to write unit tests for their CLI. See [src/\_\_tests\_\_/cli.test.ts](src/__tests__/cli.test.ts) for an example of how to unit test a `@alwaysai/always-cli` CLI.

## More information
This library has a couple dozen unit tests with >90% coverage. If you want to see more examples of how it works, [those tests](src/example) would be a good place to start. If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on this project's repository on GitHub.

## Related

## License

MIT © [alwaysAI, Inc.](https://alwaysai.co)
