import { Leaf, AnyInput } from './types';

export async function accumulateEscapedValue(leaf: Leaf<AnyInput, any>, argv: string[]) {
  let argsValue: any = undefined;
  let errorMessage: string | undefined = undefined;
  if (leaf.args) {
    const { required, placeholder } = leaf.args;
    if (argv.length === 0) {
      if (required) {
        errorMessage = `"${placeholder}": Value is required`;
      } else {
        argsValue = await leaf.args.getValue(undefined);
      }
    } else {
      argsValue = await leaf.args.getValue(argv);
    }
  } else {
    // !leaf.args
    if (argv.length > 0) {
      errorMessage = `Unexpected argument "${argv[0]}"`;
    }
  }
  return { argsValue, errorMessage };
}
