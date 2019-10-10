import { AnyNamedInputs, CliLeaf, ExcludeCommandType, AnyInput, CliInput } from './types';
import { CLI_LEAF } from './constants';

export function CliLeaf<
  TPositional extends AnyInput = CliInput<undefined, false>,
  TNamed extends AnyNamedInputs = {},
  TEscaped extends AnyInput = CliInput<undefined, false>
>(config: ExcludeCommandType<CliLeaf<TPositional, TNamed, TEscaped>>) {
  const cliLeaf: CliLeaf<TPositional, TNamed, TEscaped> = {
    ...config,
    commandType: CLI_LEAF,
  };
  return cliLeaf;
}
