import { AnyOptions, Leaf, Branch } from './types';
import { BRANCH, LEAF } from './constants';

// The "commandType" field is assigned internally by the framework
type ExcludeCommandType<T extends { commandType: any }> = Pick<
  T,
  Exclude<keyof T, 'commandType'>
>;

export const createLeaf = <O extends AnyOptions = {}>(
  cmd: ExcludeCommandType<Leaf<O>>,
): Leaf<O> => ({
  ...cmd,
  commandType: LEAF,
});

export const createBranch = (cmd: ExcludeCommandType<Branch>): Branch => ({
  ...cmd,
  commandType: BRANCH,
});
