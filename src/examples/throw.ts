import { createLeaf, createStringInput } from '..';
import { createCli } from '../create-cli';
import { runAndExit } from '@carnesen/run-and-exit';
import { CodedError } from '@carnesen/coded-error';
import { createJsonInput } from '../input-factories/create-json-input';
import { USAGE } from '../usage-error';
import { TERSE } from '../terse-error';

export const root = createLeaf({
  commandName: 'throw',
  description: 'Print messages to the console',
  namedInputs: {
    message: createStringInput({
      description: 'A message',
      required: true,
    }),
    code: createStringInput({
      description: `A string "code" attached to the error. Try "${USAGE}" and "${TERSE}"`,
    }),
    data: createJsonInput({
      description: 'An arbitrary "data" field on the error object',
    }),
  },
  action({ message, code, data }) {
    throw new CodedError(message, code, data);
  },
});

const cli = createCli(root);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
