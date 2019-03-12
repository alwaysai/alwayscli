import { createCommandInterface } from './create-command-interface';
import { runAndExit } from '@carnesen/run-and-exit';

export function createCommandLineInterface(
  ...args: Parameters<typeof createCommandInterface>
) {
  return function commandLineInterface(argv = process.argv.slice(2)) {
    runAndExit(() => {
      const commandInterface = createCommandInterface(...args);
      return commandInterface(argv);
    });
  };
}
