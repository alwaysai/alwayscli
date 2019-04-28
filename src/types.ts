import { BRANCH, LEAF } from './constants';

export type Argv<R extends boolean> = R extends true ? string[] : (string[] | undefined);

export type Input<V, R extends boolean = boolean> = {
  placeholder: string;
  required?: R;
  hidden?: boolean;
  getValue: ((argv: Argv<R>) => V) | ((argv: Argv<R>) => Promise<V>);
  getDescription: () => string | undefined;
};

export type AnyInput = Input<any>;

export type InputValue<T> = T extends Input<infer U, any> ? U : never;

export type AnyNamedInputs = {
  [argName: string]: AnyInput;
};

export type NamedInputValues<T extends AnyNamedInputs> = {
  [K in keyof T]: InputValue<T[K]>
};

export type Command = Branch | Leaf<AnyInput, AnyNamedInputs>;

export type Branch = {
  _type: typeof BRANCH;
  name: string;
  description?: string;
  hidden?: boolean;
  subcommands: (Branch | Leaf<any, any>)[];
  version?: string;
};

export type Leaf<T extends AnyInput, U extends AnyNamedInputs> = {
  _type: typeof LEAF;
  name: string;
  description?: string;
  hidden?: boolean;
  args?: T;
  options?: U;
  action: (args: InputValue<T>, options: NamedInputValues<U>) => any;
  version?: string;
};

// The "_type" field is assigned internally by the framework.
// This helper function is used to remove that field for the input
// type of the createLeaf and createBranch factories.
export type ExcludeInternallyAssigned<T extends { _type: any }> = Pick<
  T,
  Exclude<keyof T, '_type'>
>;

export type CommandStack = {
  branches: Branch[];
  leaf?: Leaf<AnyInput, any>;
};
