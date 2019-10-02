import { Leaf, AnyInput } from './types';

export async function callGetValue(input?: AnyInput, argv?: string[]) {
  let value: any = undefined;
  let errorMessage: string | undefined = undefined;
  if (input) {
    const { required, placeholder, getValue } = input;
    if (!argv || argv.length === 0) {
      if (required) {
        errorMessage = `"${placeholder}": Value is required`;
      } else {
        value = await getValue(undefined);
      }
    } else {
      value = await getValue(argv);
    }
  } else {
    // !input
    if (argv && argv.length > 0) {
      errorMessage = `Unexpected argument "${argv[0]}"`;
    }
  }
  return { value, errorMessage };
}
