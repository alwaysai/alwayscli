import { CliBranch, ExcludeCommandType } from './types';
import { BRANCH } from './constants';

type Config = ExcludeCommandType<CliBranch>;

export function CliBranch(config: Config) {
  const branch: CliBranch = {
    ...config,
    commandType: BRANCH,
  };
  return branch;
}
