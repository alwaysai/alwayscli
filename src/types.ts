import { BRANCH, LEAF } from './constants';

type Argv<TRequired extends boolean> = TRequired extends true
  ? string[]
  : (string[] | undefined);

export type CliInput<TValue, TRequired extends boolean = boolean> = {
  placeholder: string;
  getValue:
    | ((argv: Argv<TRequired>) => TValue)
    | ((argv: Argv<TRequired>) => Promise<TValue>);
  description?: string;
  required?: TRequired;
  hidden?: boolean;
};

export type AnyInput = CliInput<any>;

export type InputValue<TInput> = TInput extends CliInput<infer U, any> ? U : never;

export type AnyNamedInputs = {
  [name: string]: AnyInput;
};

export type NamedValues<TNamedInputs extends AnyNamedInputs> = {
  [K in keyof TNamedInputs]: InputValue<TNamedInputs[K]>
};

export type Command = CliBranch | CliLeaf<AnyInput, AnyNamedInputs, AnyInput>;

export type CliBranch = {
  commandType: typeof BRANCH;
  name: string;
  description?: string;
  hidden?: boolean;
  subcommands: (CliBranch | CliLeaf<any, any, any>)[];
  next?: CliBranch | CliLeaf<any, any, any>;
};

export type CliLeaf<
  TPositional extends AnyInput,
  TNamed extends AnyNamedInputs,
  TEscaped extends AnyInput
> = {
  commandType: typeof LEAF;
  name: string;
  action: (
    positionalValue: InputValue<TPositional>,
    namedValues: NamedValues<TNamed>,
    escapedValue: InputValue<TEscaped>,
  ) => any;
  positionalInput?: TPositional;
  namedInputs?: TNamed;
  escapedInput?: TEscaped;
  description?: string;
  hidden?: boolean;
};

// The "commandType" field is assigned internally by the framework.
// This helper function is used to remove that field for the input
// type of the createLeaf and CliBranch factories.
export type ExcludeCommandType<T extends { commandType: any }> = Pick<
  T,
  Exclude<keyof T, 'commandType'>
>;
