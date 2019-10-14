# `alwaysCLI` [![Build Status](https://travis-ci.com/alwaysai/alwayscli.svg?branch=master)](https://travis-ci.com/alwaysai/alwayscli)

A framework for building command-line interfaces (CLIs) in Node.js. This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

```
npm install @alwaysai/alwayscli
```

In an `alwaysCLI` program, commands are organized into a tree. Each "leaf" represents an action whereas "branches" collect and organize leaves. For example, in the command `alwaysai user login`, `alwaysai` is the "root" command (a branch), `user` is a branch of commands related to user authentication and `login` is the action leaf. Your CLI need not have branches. Here is a simple CLI whose root is a leaf:
```ts
// readme.ts
import {
  CliLeaf,
  CliFlagInput,
  CliNumberArrayInput,
  runCliAndExit,
} from '@alwaysai/alwayscli';

export const root = CliLeaf({
  name: 'multiply',
  description: 'Multiply numbers and print the result',
  positionalInput: CliNumberArrayInput({ required: true }),
  namedInputs: {
    squared: CliFlagInput({
      description: 'Square the result before printing it',
    }),
  },
  action(args, { squared }) {
    const multiplied = args.reduce((a, b) => a * b, 1);
    if (squared) {
      return multiplied * multiplied;
    }
    return multiplied;
  },
});

if (require.main === module) {
  runCliAndExit(root);
}
```

Here's how that behaves as a CLI.
```
$ ts-node readme.ts
Usage: multiply <num0> [...] [<options>]

   Multiply numbers and print the result

Options:

   [--squared] : Square the result before printing it

Error: "<num0> [...]": Value is required
```

With arguments:
```
$ ts-node readme.ts 1 2 3
6
$ ts-node readme.ts 1 2 3 --squared
36 
```
The `if (require.main === module)` conditional is Node.js for "if this file is the entry point", which is `true` when you do `ts-node readme.ts`, but not when you do `import { root } from './readme.ts'` for unit tests for example.

More generally the usage of an `alwaysCLI` CLI is:
```
<program> <branch> <leaf> <positional-args> --name <named-args> -- <escaped-args>
```
To invoke an action the user provides (in order):
- zero or more branch names
- a leaf name
- zero or more positional args
- zero or more "options" (inputs of the form `--foo bar`)

## API
### Input<T, U>
TODO

### CliLeaf({name, description?, args?, options?, action, hidden?, version?})
A factory for creating "action" commands. Returns the newly-created `leaf`.

#### name
If this "leaf" is a subcommand, `name` is the string that the user will pass as the "subcommand" argument to invoke this action. If this "leaf" is the root command, `name` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### positionalInput
(Optional) An `Input` for 

#### namedInputs
(Optional) An object of named `Input`s, for example:
```ts
const options = {
  path: createStringInput({
    description: 'An absolute or relative path',
  }),
}
```
The `args` and `options` properties define how the command-line arguments get parsed and transformed before being passed into the `action` function.

#### action(args, options)
The function that defines your command logic. `action` can return a value synchronously like in the "multiply" example above, or it can be an `async` function that returns a `Promise`. If `action` returns/resolves a value, that value is `console.log`ged before the CLI exits. If `action` throws/rejects, the exception is `console.log`ged before the CLI exits. That means that if you don't want the user to see a stack trace, your `action` should throw a `string` instead of an `Error` object. The type of the `args` argument received by `action` is derived by the `args` property of the leaf. Similarly, the `options` argument type is derived from `leaf.options`.

#### hidden
(Optional) `boolean`

#### version
(Optional) `string`. If provided, this string will be printed when the user does `cli --version` or `cli -v`. If this value is not provided, alwaysCLI will attempt to find a version string in your package.json file.

### CliBranch({name, description, subcommands, hidden?})
A factory function similar to `CliLeaf`. Returns the newly-created `Branch` object.

#### name
If this "branch" is not the root command, `name` is the string that the user will pass as the "subcommand" argument to invoke actions in this part of the command tree. If this "branch" command is the root command, `name` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### subcommands
An array of `Branch` and/or `Leaf` objects.

#### hidden
(Optional) `boolean`

### createCli(root)
Returns a function of the form `(...args: string[]) => Promise<any>` that can be invoked as e.g. `cli('foo', 'bar')` for unit tests or as `cli(process.argv.slice(2))` in an executable CLI script.

#### root
A `Leaf` or `Branch`

### ArgvInterface
`cli` is a function that takes command-line arguments (strings) as input and returns a `Promise` representing the execution of the arguments. We export `cli` so that we can unit test it [like so](src/examples/__tests__/readme.test.ts). 

## More information
This library has a couple dozen unit tests with >90% coverage. If you want to see more examples of how things works, check out the `.test.ts` files in the [src](src) directory. Also check out [src/examples](src/examples). If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on this project's repository on GitHub.

## License

MIT © [alwaysAI, Inc.](https://alwaysai.co)
