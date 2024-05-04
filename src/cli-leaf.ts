import { AnyNamedInputs, CliLeaf, ExcludeCommandType, CliInput } from './types';
import { CLI_LEAF } from './constants';

export function CliLeaf<
  TPositional extends CliInput<any> = CliInput<undefined, false>,
  TNamed extends AnyNamedInputs = AnyNamedInputs,
  TEscaped extends CliInput<any> = CliInput<undefined, false>
>(config: ExcludeCommandType<CliLeaf<TPositional, TNamed, TEscaped>>) {
  const cliLeaf: CliLeaf<TPositional, TNamed, TEscaped> = {
    ...config,
    commandType: CLI_LEAF
  };
  return cliLeaf;
}
