// Arg type for custom arg types
export { CliInput as Input } from './types';

// Command factories:
export { CliBranch } from './cli-branch';
export { CliLeaf as Leaf } from './cli-leaf';

// Command-line interface factory
export { runCliAndExit } from './run-cli-and-exit';

// Option factories:
export { CliFlagInput as createFlagInput } from './input-factories/cli-flag-input';
export { createJsonInput } from './input-factories/create-json-input';
export { createNumberArrayInput } from './input-factories/create-number-array-input';
export { createNumberInput } from './input-factories/create-number-input';
export { createOneOfInput } from './input-factories/create-one-of-input';
export { createStringArrayInput } from './input-factories/create-string-array-input';
export { createStringInput } from './input-factories/create-string-input';

// Error constructors
export { TerseError, TERSE } from './terse-error';
export { UsageError, USAGE } from './usage-error';

// Re-export for convenience
export { runAndCatch } from '@carnesen/run-and-catch';
export { runAndExit } from '@carnesen/run-and-exit';
