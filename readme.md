# `alwaysCLI` [![Build Status](https://travis-ci.com/alwaysai/always-cli.svg?branch=master)](https://travis-ci.com/alwaysai/always-cli)

A framework for building command-line interfaces (CLIs) in Node.js. This package includes runtime JavaScript files suitable for Node.js >=8 as well as the corresponding TypeScript type declarations.

## Usage

```
npm install @alwaysai/always-cli
```

In an `alwaysCLI` CLI, commands are organized into a tree. Each "leaf" represents an action whereas "branches" collect and organize leaves. For example, in the command `alwaysai user logIn`, `alwaysai` is the "root" command, `user` is a branch of commands related to user authentication and `logIn` is the specific action (leaf command). Your CLI need not have branches. Here is a simple CLI that has a leaf as its root:
```ts
import {
  createCli,
  createLeaf,
  createFlagInput,
  createNumberArrayInput,
  runAndExit,
} from '@alwaysai/always-cli';

const root = createLeaf({
  name: 'multiply',
  description: 'Multiply numbers and print the result',
  args: createNumberArrayInput({ required: true }),
  options: {
    squared: createFlagInput({
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

export const cli = createCli(root);

if (require.main === module) {
  runAndExit(cli, ...process.argv.slice(2));
}
```

`cli` is a function that takes command-line arguments (strings) as input and returns a `Promise` representing the execution of the arguments. We export `cli` so that we can unit test it [like so](src/examples/__tests__/readme.test.ts). The `if (require.main === module)` snippet near the end is idiomatic Node.js for "if this module is the entrypoint", which is `true` when you do `node readme.ts`, but not when you do `require('./readme.ts')`, for example in a unit test. The `runAndExit` helper just runs the provided function with the provided arguments, `console.log`s the result, then `process.exit`'s.

Here's how that behaves as a CLI. In this case since the `args` property of the leaf has `required` set to `true`, `alwaysCLI` will print the top-level command usage and an error message if no positional arguments are provided:
```
$ multiply
Usage: multiply <num0> [...] [<options>]

   Multiply numbers and print the result

Options:

   [--squared] : Square the result before printing it

Error: "<num0> [...]": Value is required
```

With arguments:
```
$ multiply 1 2 3
6
$ multiply 1 2 3 --squared
36 
```

More generally the usage of an `alwaysCLI` CLI is:
```
<program> [<branch0> ...] [leaf] [<arg0> [...]] [--option0 <val0> ...] [...]
```
To invoke an action the user provides (in order):
- zero or more branch names
- a leaf name
- zero or more positional args
- zero or more "options" (inputs of the form `--foo bar`)

## API
### Input<T, U>
TODO

### createLeaf({name, description?, args?, options?, action, hidden?, version?})
A factory for creating "action" commands. Returns the newly-created `leaf`.

#### name
If this "leaf" is a subcommand, `name` is the string that the user will pass as the "subcommand" argument to invoke this action. If this "leaf" is the root command, `name` should be the CLI's name.

#### description
(Optional) A string that will be included in `Usage:` if present.

#### args
(Optional) An `Input` for 

#### options 
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

### createBranch({name, description, subcommands, hidden?})
A factory function similar to `createLeaf`. Returns the newly-created `Branch` object.

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

## More information
This library has a couple dozen unit tests with >90% coverage. If you want to see more examples of how things works, check out the `.test.ts` files in the [src](src) directory. Also check out [src/examples](src/examples). If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on this project's repository on GitHub.

## License

MIT © [alwaysAI, Inc.](https://alwaysai.co)
