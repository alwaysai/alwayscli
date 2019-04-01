import { Branch, ExcludeCommandType } from './types';
import { BRANCH } from './constants';
import { regularizeText } from './util';

export const createBranch = (cmd: ExcludeCommandType<Branch>): Branch => ({
  ...cmd,
  commandType: BRANCH,
  description: regularizeText(cmd.description),
});
