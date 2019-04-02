import { accumulateArgsValue } from './accumulate-args-value';
import { createLeaf } from './create-leaf';

describe(accumulateArgsValue.name, () => {
  it('returns ', async () => {
    const leaf = createLeaf({
      name: 'foo',
      args: {
        placeholder: '<foo>',
        getValue() {
          return 'carl';
        },
      },
      action(_) {},
    });
    const { argsValue, errorMessage } = await accumulateArgsValue(leaf, ['foo']);
    expect(argsValue).toBe('carl');
    expect(errorMessage).toBe(undefined);
  });
});
