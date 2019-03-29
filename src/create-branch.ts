import { Branch, ExcludeCommandType } from './types';
import { BRANCH } from './constants';

export const createBranch = (cmd: ExcludeCommandType<Branch>): Branch => ({
  ...cmd,
  commandType: BRANCH,
});
