import { CliBranch, ExcludeCommandType } from './types';
import { CLI_BRANCH } from './constants';

type Config = ExcludeCommandType<CliBranch>;

export function CliBranch(config: Config) {
  const branch: CliBranch = {
    ...config,
    commandType: CLI_BRANCH
  };
  return branch;
}
