import readPkgUp = require('read-pkg-up');
import { dirname } from 'path';

export async function findVersion() {
  const mainModule = require.main;
  if (!mainModule) {
    // We not sure under what circumstances require.main would be undefined but
    // the NodeJS types say it might be.
    return undefined;
  }

  const found = await readPkgUp({
    cwd: dirname(mainModule.filename),
    normalize: false,
  });

  if (!found) {
    return undefined;
  }

  if (!found.packageJson.version) {
    return undefined;
  }
  return found.packageJson.version;
}
