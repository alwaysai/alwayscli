import { AnyNamedInputs, Leaf, ExcludeCommandType } from './types';
import { LEAF } from './constants';
import { regularizeText } from './util';

export const createLeaf = <O extends AnyNamedInputs = {}>(
  cmd: ExcludeCommandType<Leaf<O>>,
): Leaf<O> => ({
  ...cmd,
  commandType: LEAF,
  description: regularizeText(cmd.description),
});
