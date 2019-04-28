import { accumulateArgsValue } from './accumulate-args-value';
import { createLeaf } from './create-leaf';
import { Input } from './types';

describe(accumulateArgsValue.name, () => {
  it('returns ', async () => {
    const args: Input<string, false> = {
      placeholder: '<foo>',
      getValue() {
        return 'carl';
      },
      getDescription: () => '',
    };
    const leaf = createLeaf({
      name: 'foo',
      args,
      action(_) {},
    });
    const { argsValue, errorMessage } = await accumulateArgsValue(leaf, ['foo']);
    expect(argsValue).toBe('carl');
    expect(errorMessage).toBe(undefined);
  });
});
