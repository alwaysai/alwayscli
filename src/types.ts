import { CLI_BRANCH, CLI_LEAF } from './constants';

type ArgvForGetValue<TRequired extends boolean> = TRequired extends true
  ? string[]
  : (string[] | undefined);

export type CliInput<TValue, TRequired extends boolean = boolean> = {
  placeholder: string;
  getValue:
    | ((argv: ArgvForGetValue<TRequired>) => TValue)
    | ((argv: ArgvForGetValue<TRequired>) => Promise<TValue>);
  description?: string;
  required?: TRequired;
  hidden?: boolean;
};

export type AnyInput = CliInput<any>;

export type ValueFromInput<TInput> = TInput extends CliInput<infer U, any> ? U : never;

export type AnyNamedInputs = {
  [name: string]: AnyInput;
};

export type NamedValues<TNamedInputs extends AnyNamedInputs> = {
  [K in keyof TNamedInputs]: ValueFromInput<TNamedInputs[K]>
};

export type CliBranch = {
  commandType: typeof CLI_BRANCH;
  name: string;
  description?: string;
  hidden?: boolean;
  subcommands: (CliBranch | CliLeaf<any, any, any>)[];
  next?: CliBranch | CliLeaf<any, any, any>;
};

export type CliLeaf<
  TPositionalInput extends AnyInput,
  TNamedInputs extends AnyNamedInputs,
  TEscapedInput extends AnyInput
> = {
  commandType: typeof CLI_LEAF;
  name: string;
  action: (
    positionalValue: ValueFromInput<TPositionalInput>,
    namedValues: NamedValues<TNamedInputs>,
    escapedValue: ValueFromInput<TEscapedInput>,
  ) => any;
  positionalInput?: TPositionalInput;
  namedInputs?: TNamedInputs;
  escapedInput?: TEscapedInput;
  description?: string;
  hidden?: boolean;
};

export type Command = CliBranch | CliLeaf<AnyInput, AnyNamedInputs, AnyInput>;
export type AnyCommand = CliBranch | CliLeaf<any, any, any>;

// The "commandType" field is assigned internally by the framework.
// This helper function is used to remove that field for the input
// type of the createLeaf and CliBranch factories.
export type ExcludeCommandType<T extends { commandType: any }> = Pick<
  T,
  Exclude<keyof T, 'commandType'>
>;
