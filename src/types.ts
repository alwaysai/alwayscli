import { BRANCH, LEAF } from './constants';

export type Argv<TRequired extends boolean> = TRequired extends true
  ? string[]
  : (string[] | undefined);

export type AnyArgv = Argv<boolean>;

export type CliInput<TValue, TRequired extends boolean = boolean> = {
  placeholder: string;
  required?: TRequired;
  hidden?: boolean;
  getValue:
    | ((argv: Argv<TRequired>) => TValue)
    | ((argv: Argv<TRequired>) => Promise<TValue>);
  description?: string;
};

export type AnyInput = CliInput<any>;

export type InputValue<T> = T extends CliInput<infer U, any> ? U : never;

export type AnyNamedInputs = {
  [name: string]: AnyInput;
};

export type NamedValues<TNamedInputs extends AnyNamedInputs> = {
  [K in keyof TNamedInputs]: InputValue<TNamedInputs[K]>
};

export type CliCommand = CliBranch | CliLeaf<AnyInput, AnyNamedInputs, AnyInput>;

export type CliBranch = {
  _type: typeof BRANCH;
  name: string;
  description?: string;
  hidden?: boolean;
  subcommands: (CliBranch | CliLeaf<any, any, any>)[];
  next?: CliBranch | CliLeaf<any, any, any>;
};

export type CliLeaf<T extends AnyInput, U extends AnyNamedInputs, V extends AnyInput> = {
  _type: typeof LEAF;
  name: string;
  description?: string;
  hidden?: boolean;
  args?: T;
  options?: U;
  escaped?: V;
  action: (args: InputValue<T>, options: NamedValues<U>, escaped: InputValue<V>) => any;
};

// The "_type" field is assigned internally by the framework.
// This helper function is used to remove that field for the input
// type of the createLeaf and CliBranch factories.
export type ExcludeInternallyAssigned<T extends { _type: any }> = Pick<
  T,
  Exclude<keyof T, '_type'>
>;
