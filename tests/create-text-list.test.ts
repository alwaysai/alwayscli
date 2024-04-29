import { createTextList } from '../src/create-text-list';

describe(createTextList.name, () => {
  it('Creates a usage string for a branch', () => {
    const usageString = createTextList(
      { name: 'foo', text: 'hi\n   bye' },
      { name: 'barrio', text: 'bye' }
    );
    expect(usageString).toMatchSnapshot();
  });
});
