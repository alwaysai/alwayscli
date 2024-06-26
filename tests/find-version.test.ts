import { findVersion } from '../src/find-version';
import * as packageJson from '../package.json';

describe(findVersion.name, () => {
  it('finds a package version by looking upwards in the filesystem from require.main', async () => {
    // In the context of unit tests, this file is the entry point `require.main`.
    expect(await findVersion()).toBe(packageJson.version);
  });
});
