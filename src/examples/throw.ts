import { CodedError } from '@carnesen/coded-error';
import { CliLeaf } from '../cli-leaf';
import { createStringInput } from '../input-factories/create-string-input';
import { createOneOfInput } from '../input-factories/create-one-of-input';
import { TERSE } from '../terse-error';
import { USAGE } from '../usage-error';
import { createJsonInput } from '../input-factories/create-json-input';
import { runCliAndExit } from '../run-cli-and-exit';

export const root = CliLeaf({
  name: 'throw',
  description: 'Throw a CodedError in the "action" function',
  options: {
    message: createStringInput({
      description: 'A message',
      required: true,
    }),
    code: createOneOfInput({
      values: [USAGE, TERSE],
      description: `A string "code" attached to the error.`,
    }),
    data: createJsonInput({
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
