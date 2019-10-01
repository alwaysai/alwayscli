import readPkgUp = require('read-pkg-up');
import { dirname } from 'path';

export async function findVersion() {
  const mainModule = require.main;
  if (!mainModule) {
    return;
  }

  const found = await readPkgUp({
    cwd: dirname(mainModule.filename),
  });
  if (!found) {
    return;
  }

  if (!found.packageJson.version) {
    return;
  }
  return found.packageJson.version;
}
