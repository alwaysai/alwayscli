import { CodedError } from '@carnesen/coded-error';
import { CliLeaf } from '../src/cli-leaf';
import { CLI_TERSE_ERROR, CliTerseError } from '../src/cli-terse-error';
import { CliUsageError } from '../src/cli-usage-error';
import { RED_ERROR } from '../src/constants';
import { runCliAndExit } from '../src/run-cli-and-exit';

async function runMocked(action: () => any) {
  const result = {
    consoleLog: jest.fn(),
    consoleError: jest.fn(),
    processExit: jest.fn()
  };
  await runCliAndExit(
    CliLeaf({
      name: 'cli',
      action
    }),
    {
      argv: [],
      ...result
    }
  );

  expect(result.processExit.mock.calls.length).toBe(1);
  expect(result.processExit.mock.calls[0].length).toBe(1);
  const exitCode = result.processExit.mock.calls[0][0];

  expect(
    result.consoleError.mock.calls.length + result.consoleLog.mock.calls.length
  ).toBeLessThanOrEqual(1);
  let errorMessage: any = undefined;
  let logMessage: any = undefined;
  if (result.consoleLog.mock.calls.length === 1) {
    expect(result.consoleLog.mock.calls.length).toBe(1);
    logMessage = result.consoleLog.mock.calls[0][0];
  }
  if (result.consoleError.mock.calls.length === 1) {
    expect(result.consoleError.mock.calls.length).toBe(1);
    errorMessage = result.consoleError.mock.calls[0][0];
  }
  return { exitCode, errorMessage, logMessage };
}

describe(runCliAndExit.name, () => {
  it('exits 0 and does not console.log if action succeeds', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(jest.fn());
    expect(exitCode).toBe(0);
    expect(errorMessage).toBe(undefined);
    expect(logMessage).toBe(undefined);
  });

  it('exits 0 and console.logs resolved value if action succeeds', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => 'foo');
    expect(exitCode).toBe(0);
    expect(errorMessage).toBe(undefined);
    expect(logMessage).toBe('foo');
  });

  it('exits 1 and console.errors "non-truthy exception" if action throws a non-truthy exception', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw '';
    });
    expect(exitCode).toBe(1);
    expect(errorMessage).toMatch('non-truthy exception');
    expect(logMessage).toBe(undefined);
  });

  it('exits 1 and console.errors a usage string if action throws a UsageError', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw new CliUsageError();
    });
    expect(exitCode).toBe(1);
    expect(errorMessage).toMatch('Usage');
    expect(logMessage).toBe(undefined);
  });

  it('exits 1 and console.errors a red error message if action throws a TerseError', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw new CliTerseError('foo');
    });
    expect(exitCode).toBe(1);
    expect(errorMessage).toMatch(RED_ERROR);
    expect(errorMessage).toMatch('foo');
    expect(logMessage).toBe(undefined);
  });

  it('exits 1 and console.errors the full error if action throws a TerseError without a message', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw new CliTerseError('');
    });
    expect(exitCode).toBe(1);
    expect(typeof errorMessage).toBe('object');
    expect(errorMessage.code).toBe(CLI_TERSE_ERROR);
    expect(logMessage).toBe(undefined);
  });

  it('exits with the specified code if the code is a number', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw new CodedError('', 123);
    });
    expect(exitCode).toBe(123);
    expect(errorMessage).toBe(undefined);
    expect(logMessage).toBe(undefined);
  });

  it('exits with the specified code if the code is a number and console.errors the message if there is one', async () => {
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw new CodedError('foo', 123);
    });
    expect(exitCode).toBe(123);
    expect(errorMessage).toBe('foo');
    expect(logMessage).toBe(undefined);
  });

  it('console.errors any other error thrown and exits 1', async () => {
    const error = new Error();
    const { exitCode, errorMessage, logMessage } = await runMocked(() => {
      throw error;
    });
    expect(exitCode).toBe(1);
    expect(errorMessage).toBe(error);
    expect(logMessage).toBe(undefined);
  });

  it('uses sensible defaults for all options', async () => {
    runCliAndExit(
      CliLeaf({
        name: 'cli',
        action: jest.fn()
      }),
      { processExit: jest.fn(), argv: [] }
    ).catch(console.error);
  });

  it("passes a postRun argument and assures it's been called", async () => {
    const postRunMock = jest.fn();
    await runCliAndExit(
      CliLeaf({
        name: 'cli',
        action: jest.fn()
      }),
      {
        processExit: jest.fn(),
        postRun: postRunMock
      }
    );
    expect(postRunMock).toHaveBeenCalled();
  });
});
