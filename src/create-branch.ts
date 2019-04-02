import { Branch, ExcludeUnderscoreType } from './types';
import { BRANCH } from './constants';

type Config = ExcludeUnderscoreType<Branch>;

export function createBranch(config: Config) {
  const branch: Branch = {
    ...config,
    _type: BRANCH,
  };
  return branch;
}
