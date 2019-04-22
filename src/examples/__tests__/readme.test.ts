import { cli } from '../readme';

describe('readme example', () => {
  it('multiplies the provided numbers together', async () => {
    expect(await cli('1', '2', '3')).toBe(6);
  });
  it('squares the result if --squared is passed', async () => {
    expect(await cli('1', '2', '3', '--squared')).toBe(36);
  });
});
