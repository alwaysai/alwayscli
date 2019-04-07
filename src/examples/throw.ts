import {
  createCli,
  createLeaf,
  createStringInput,
  createJsonInput,
  createOneOfInput,
  USAGE,
  TERSE,
} from '..';
import { runAndExit } from '@carnesen/run-and-exit';
import { CodedError } from '@carnesen/coded-error';

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
  action(_, { message, code, data }) {
    throw new CodedError(message, code, data);
  },
});

const cli = createCli(throw_);

if (module === require.main) {
  runAndExit(cli, ...process.argv.slice(2));
}
