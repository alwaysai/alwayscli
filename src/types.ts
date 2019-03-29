import { BRANCH, LEAF } from './constants';

export type Argv<R extends boolean> = R extends true ? string[] : (string[] | undefined);

type GetValueSync<V, R extends boolean> = (argv: Argv<R>) => V;
type GetValueAsync<V, R extends boolean> = (argv: Argv<R>) => Promise<V>;
type GetValue<V, R extends boolean> = GetValueSync<V, R> | GetValueAsync<V, R>;

type AnyGetValue = GetValue<any, any>;

export type Option<V, R extends boolean = boolean> = {
  required?: R;
  getValue: GetValue<V, R>;
  getDescription?: () => string | undefined;
  placeholder: string;
};

export type AnyOption = Option<any>;

export type Value<T extends AnyGetValue> = T extends GetValueAsync<infer U, any>
  ? U
  : T extends GetValueSync<infer U, any>
  ? U
  : never;

export type AnyOptions = {
  [optionName: string]: AnyOption;
};

export type NamedArgs<O extends AnyOptions> = { [K in keyof O]: Value<O[K]['getValue']> };

export type Command = Branch | Leaf<AnyOptions>;

export type Branch = {
  commandType: typeof BRANCH;
  commandName: string;
  description?: string;
  subcommands: (Branch | Leaf<any>)[];
};

export type Leaf<O extends AnyOptions> = {
  commandType: typeof LEAF;
  commandName: string;
  description?: string;
  options?: O;
  action: (namedArgs: NamedArgs<O>) => any;
};

// The "commandType" field is assigned internally by the framework
export type ExcludeCommandType<T extends { commandType: any }> = Pick<
  T,
  Exclude<keyof T, 'commandType'>
>;
