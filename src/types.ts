import { BRANCH, LEAF } from './constants';

export type Argv<R extends boolean> = R extends true ? string[] : (string[] | undefined);

type GetValueSync<V, R extends boolean> = (argv: Argv<R>) => V;
type GetValueAsync<V, R extends boolean> = (argv: Argv<R>) => Promise<V>;
type GetValue<V, R extends boolean> = GetValueSync<V, R> | GetValueAsync<V, R>;

type AnyGetValue = GetValue<any, any>;

export type Input<V, R extends boolean = boolean> = {
  required?: R;
  getValue: GetValue<V, R>;
  getDescription?: () => string | undefined;
  placeholder: string;
};

export type AnyInput = Input<any>;

export type InputValue<T extends AnyGetValue> = T extends GetValueAsync<infer U, any>
  ? U
  : T extends GetValueSync<infer U, any>
  ? U
  : never;

export type AnyNamedInputs = {
  [argName: string]: AnyInput;
};

export type NamedValues<T extends AnyNamedInputs> = {
  [K in keyof T]: InputValue<T[K]['getValue']>
};

export type Command = Branch | Leaf<AnyNamedInputs>;

export type Branch = {
  commandType: typeof BRANCH;
  commandName: string;
  description?: string;
  subcommands: (Branch | Leaf<any>)[];
};

export type Leaf<T extends AnyNamedInputs> = {
  commandType: typeof LEAF;
  commandName: string;
  description?: string;
  namedInputs?: T;
  action: (namedArgs: NamedValues<T>) => any;
};

// The "commandType" field is assigned internally by the framework.
// This helper function is used to remove that field for user use.
export type ExcludeCommandType<T extends { commandType: any }> = Pick<
  T,
  Exclude<keyof T, 'commandType'>
>;

export type CommandStack = {
  branches: Branch[];
  leaf?: Leaf<any>;
};
