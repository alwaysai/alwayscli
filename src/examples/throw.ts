import { CodedError } from '@carnesen/coded-error';
import { CliLeaf } from '../cli-leaf';
import { CliStringInput } from '../cli-string-input';
import { CliOneOfInput } from '../cli-one-of-input';
import { TERSE } from '../cli-terse-error';
import { USAGE } from '../cli-usage-error';
import { CliJsonInput } from '../cli-json-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const root = CliLeaf({
  name: 'throw',
  description: 'Throw a CodedError in the "action" function',
  namedInputs: {
    message: CliStringInput({
      description: 'A message',
      required: true,
    }),
    code: CliOneOfInput({
      values: [USAGE, TERSE],
      description: `A string "code" attached to the error.`,
    }),
    data: CliJsonInput({
      description: 'An arbitrary "data" field on the error object',
    }),
  },
  action(_, { message, code, data }) {
    throw new CodedError(message, code, data);
  },
});

if (module === require.main) {
  runCliAndExit(root);
}
