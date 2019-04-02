import { AnyOptions, Leaf, ExcludeUnderscoreType, AnyInput } from './types';
import { LEAF } from './constants';

export function createLeaf<T extends AnyInput = AnyInput, U extends AnyOptions = {}>(
  config: ExcludeUnderscoreType<Leaf<T, U>>,
) {
  const leaf: Leaf<T, U> = {
    ...config,
    _type: LEAF,
  };
  return leaf;
}
