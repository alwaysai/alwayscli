import {
  AnyNamedInputs,
  Leaf,
  ExcludeInternallyAssigned,
  AnyInput,
  Input,
} from './types';
import { LEAF } from './constants';

export function createLeaf<
  T extends AnyInput = Input<never, false>,
  U extends AnyNamedInputs = {}
>(config: ExcludeInternallyAssigned<Leaf<T, U>>) {
  const leaf: Leaf<T, U> = {
    ...config,
    _type: LEAF,
  };
  return leaf;
}
