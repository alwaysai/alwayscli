import { findVersion } from './find-version';

describe(findVersion.name, () => {
  it('finds a package version by looking upwards in the filesystem', async () => {
    expect(await findVersion()).toBe(require('../package.json').version);
  });
});
