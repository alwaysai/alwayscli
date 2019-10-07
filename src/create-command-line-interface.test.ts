import { runAndCatch } from '@carnesen/run-and-catch';
import { createLeaf } from './create-leaf';
import { UsageError } from './usage-error';
import { createCommandLineInterface } from './create-command-line-interface';

describe(createCommandLineInterface.name, () => {
  it('throws getUsage string if argvInterface throws USAGE error', async () => {
    const commandLineInterface = createCommandLineInterface(
      createLeaf({
        name: 'cli',
        action() {
          throw new UsageError();
        },
      }),
    );
    const exception = await runAndCatch(commandLineInterface);
    expect(typeof exception).toBe('string');
  });
});
