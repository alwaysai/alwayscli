import { BRANCH, LEAF } from './constants';

type GetValueSync<T> = (argv?: string[]) => T;
type GetValueAsync<T> = (argv?: string[]) => Promise<T>;
type GetValue<T> = GetValueSync<T> | GetValueAsync<T>;

type AnyGetValue = GetValue<any>;

export type Option<T> = {
  getValue: GetValue<T>;
  getDescription: () => string | undefined;
  placeholder: string;
};

export type AnyOption = Option<any>;

type Value<T extends AnyGetValue> = T extends GetValueAsync<infer U>
  ? U
  : T extends GetValueSync<infer U>
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
