// Arg type for custom arg types
export { Input } from './types';

// Command factories:
export { createBranch } from './create-branch';
export { createLeaf } from './create-leaf';

// Command-line interface factory
export { createCli } from './create-cli';

// Option factories:
export { createFlagInput } from './input-factories/create-flag-input';
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
