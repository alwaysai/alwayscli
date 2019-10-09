import {
  AnyNamedInputs,
  CliLeaf,
  ExcludeInternallyAssigned,
  AnyInput,
  CliInput,
} from './types';
import { LEAF } from './constants';

export function CliLeaf<
  TPositional extends AnyInput = CliInput<undefined, false>,
  TNamed extends AnyNamedInputs = {},
  TEscaped extends AnyInput = CliInput<undefined, false>
>(config: ExcludeInternallyAssigned<CliLeaf<TPositional, TNamed, TEscaped>>) {
  const leaf: CliLeaf<TPositional, TNamed, TEscaped> = {
    ...config,
    _type: LEAF,
  };
  return leaf;
}
