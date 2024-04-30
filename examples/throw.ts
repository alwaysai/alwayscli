import { CodedError } from '@carnesen/coded-error';
import { CliLeaf } from '../src/cli-leaf';
import { CliStringInput } from '../src/cli-string-input';
import { CliOneOfInput } from '../src/cli-one-of-input';
import { CLI_TERSE_ERROR } from '../src/cli-terse-error';
import { CLI_USAGE_ERROR } from '../src/cli-usage-error';
import { CliJsonInput } from '../src/cli-json-input';
import { runCliAndExit } from '../src/run-cli-and-exit';

export const root = CliLeaf({
  name: 'throw',
  description: 'Throw a CodedError in the "action" function',
  namedInputs: {
    message: CliStringInput({
      description: 'A message',
      required: true
    }),
    code: CliOneOfInput({
      values: [CLI_USAGE_ERROR, CLI_TERSE_ERROR],
      description: `A string "code" attached to the error.`
    }),
    data: CliJsonInput({
      description: 'An arbitrary "data" field on the error object'
    })
  },
  action(_, { message, code, data }) {
    throw new CodedError(message, code, data);
  }
});

if (module === require.main) {
  runCliAndExit(root).catch(console.error);
}
