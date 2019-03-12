// Option factories:
export { createFlagOption } from './option-factories/create-flag-option';
export { createNumberArrayOption } from './option-factories/create-number-array-option';
export { createStringArrayOption } from './option-factories/create-string-array-option';
export { createStringEnumOption } from './option-factories/create-string-enum-option';
export { createStringOption } from './option-factories/create-string-option';

// Option type for custom option types
export { Option } from './types';

// Option modifiers:
export { withRequired } from './option-enhancers/with-required';
export { withDefaultValue } from './option-enhancers/with-default-value';

// Command factories:
export { createLeaf, createBranch } from './command-factories/create-command';

// Command interface factories (mostly for unit testing):
export { createCommandInterface } from './command-factories/create-command-interface';
export {
  createCaughtCommandInterface,
} from './command-factories/create-caught-command-interface';

// Command-line interface factory:
export {
  createCommandLineInterface,
} from './command-factories/create-command-line-interface';

// Checks
export { checkArgvHasValue, checkArgvLengthLessThan } from './check-argv';

// Error constructors
export { UsageError } from './usage-error';
export { FatalError } from './fatal-error';
