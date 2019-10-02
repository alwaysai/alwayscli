import {
  AnyNamedInputs,
  Leaf,
  ExcludeInternallyAssigned,
  AnyInput,
  Input,
} from './types';
import { LEAF } from './constants';

export function createLeaf<
  T extends AnyInput = Input<undefined, false>,
  U extends AnyNamedInputs = {},
  V extends AnyInput = Input<undefined, false>
>(config: ExcludeInternallyAssigned<Leaf<T, U, V>>) {
  const leaf: Leaf<T, U, V> = {
    ...config,
    _type: LEAF,
  };
  return leaf;
}
