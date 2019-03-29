// Option type for custom option types
export { Option } from './types';

// Option factories:
export { createFlagOption } from './option-factories/create-flag-option';
export { createJsonOption } from './option-factories/create-json-option';
export { createNumberArrayOption } from './option-factories/create-number-array-option';
export { createStringArrayOption } from './option-factories/create-string-array-option';
export { createStringOption } from './option-factories/create-string-option';

// Command factories:
export { createBranch } from './create-branch';
export { createLeaf } from './create-leaf';

// Command-line interface factories
export { createCli } from './create-cli';

// Error constructors
export { UsageError } from './usage-error';
export { FatalError } from './fatal-error';

// Re-export for convenience
export { runAndCatch } from '@carnesen/run-and-catch';
export { runAndExit } from '@carnesen/run-and-exit';
