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

export type AnyOptions = {
  [argName: string]: AnyInput;
};

export type NamedValues<T extends AnyOptions> = {
  [K in keyof T]: InputValue<T[K]['getValue']>
};

export type Command = Branch | Leaf<AnyInput, AnyOptions>;

export type Branch = {
  _type: typeof BRANCH;
  name: string;
  description?: string;
  subcommands: (Branch | Leaf<any, any>)[];
};

export type Leaf<T extends AnyInput, U extends AnyOptions> = {
  _type: typeof LEAF;
  name: string;
  description?: string;
  args?: T;
  options?: U;
  action: (args: InputValue<T['getValue']>, options: NamedValues<U>) => any;
};

// The "commandType" field is assigned internally by the framework.
// This helper function is used to remove that field for user use.
export type ExcludeUnderscoreType<T extends { _type: any }> = Pick<
  T,
  Exclude<keyof T, '_type'>
>;

export type CommandStack = {
  branches: Branch[];
  leaf?: Leaf<AnyInput, any>;
};
