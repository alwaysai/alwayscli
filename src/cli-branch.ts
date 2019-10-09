import { CliBranch, ExcludeInternallyAssigned } from './types';
import { BRANCH } from './constants';

type Config = ExcludeInternallyAssigned<CliBranch>;

export function CliBranch(config: Config) {
  const branch: CliBranch = {
    ...config,
    _type: BRANCH,
  };
  return branch;
}
