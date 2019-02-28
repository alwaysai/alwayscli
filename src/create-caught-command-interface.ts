import { createCommandInterface } from './create-command-interface';

export function createCaughtCommandInterface(
  ...createCommandInterfaceArgs: Parameters<typeof createCommandInterface>
) {
  const commandInterface = createCommandInterface(...createCommandInterfaceArgs);
  return async function caughtCommandInterface(
    ...args: Parameters<typeof commandInterface>
  ) {
    let threw = false;
    let returnValue: any;
    try {
      // We expect the following line to throw
      await commandInterface(...args);
    } catch (ex) {
      threw = true;
      returnValue = ex;
    }
    if (!threw) {
      throw new Error('Expected command interface to throw');
    }
    return returnValue;
  };
}
