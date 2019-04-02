import { createLeaf, createStringInput } from '..';
import { createCli } from '../create-cli';
import { runAndExit } from '@carnesen/run-and-exit';
import { CodedError } from '@carnesen/coded-error';
import { createJsonInput } from '../input-factories/create-json-input';
import { USAGE } from '../usage-error';
import { TERSE } from '../terse-error';
import { createOneOfInput } from '../input-factories/create-one-of-input';

export const throw_ = createLeaf({
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
  action({ message, code, data }) {
    throw new CodedError(message, code, data);
  },
});

const cli = createCli(throw_);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
