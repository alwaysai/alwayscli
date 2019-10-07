import { BRANCH, LEAF } from './constants';

export type Argv<TRequired extends boolean> = TRequired extends true
  ? string[]
  : (string[] | undefined);

export type AnyArgv = Argv<boolean>;

export type Input<TValue, TRequired extends boolean = boolean> = {
  placeholder: string;
  required?: TRequired;
  hidden?: boolean;
  getValue:
    | ((argv: Argv<TRequired>) => TValue)
    | ((argv: Argv<TRequired>) => Promise<TValue>);
  getDescription: () => string | undefined;
};

export type AnyInput = Input<any>;

export type InputValue<T> = T extends Input<infer U, any> ? U : never;

export type AnyNamedInputs = {
  [name: string]: AnyInput;
};

export type NamedValues<T extends AnyNamedInputs> = { [K in keyof T]: InputValue<T[K]> };

export type Command = Branch | Leaf<AnyInput, AnyNamedInputs, AnyInput>;

export type Branch = {
  _type: typeof BRANCH;
  name: string;
  description?: string;
  hidden?: boolean;
  subcommands: (Branch | Leaf<any, any, any>)[];
  version?: string;
  next?: Branch | Leaf<any, any, any>;
};

export type Leaf<T extends AnyInput, U extends AnyNamedInputs, V extends AnyInput> = {
  _type: typeof LEAF;
  name: string;
  description?: string;
  hidden?: boolean;
  args?: T;
  options?: U;
  escaped?: V;
  action: (args: InputValue<T>, options: NamedValues<U>, escaped: InputValue<V>) => any;
  version?: string;
};

// The "_type" field is assigned internally by the framework.
// This helper function is used to remove that field for the input
// type of the createLeaf and createBranch factories.
export type ExcludeInternallyAssigned<T extends { _type: any }> = Pick<
  T,
  Exclude<keyof T, '_type'>
>;
