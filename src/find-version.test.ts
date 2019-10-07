import { findVersion } from './find-version';

describe(findVersion.name, () => {
  it('finds a package version by looking upwards in the filesystem from require.main', async () => {
    // In the context of unit tests, this file is the entry point `require.main`.
    expect(await findVersion()).toBe(require('../package.json').version);
  });
});
