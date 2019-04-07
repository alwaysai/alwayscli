import { Branch, ExcludeInternallyAssigned } from './types';
import { BRANCH } from './constants';

type Config = ExcludeInternallyAssigned<Branch>;

export function createBranch(config: Config) {
  const branch: Branch = {
    ...config,
    _type: BRANCH,
  };
  return branch;
}
