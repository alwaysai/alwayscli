import { AnyOptions, Leaf, ExcludeCommandType } from './types';
import { LEAF } from './constants';

export const createLeaf = <O extends AnyOptions = {}>(
  cmd: ExcludeCommandType<Leaf<O>>,
): Leaf<O> => ({
  ...cmd,
  commandType: LEAF,
});
