import { AnyNamedInputs, Leaf, ExcludeCommandType } from './types';
import { LEAF } from './constants';

export const createLeaf = <O extends AnyNamedInputs = {}>(
  cmd: ExcludeCommandType<Leaf<O>>,
): Leaf<O> => ({
  ...cmd,
  commandType: LEAF,
});
