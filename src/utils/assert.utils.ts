import { isDefined } from './is-defined';

class AssertionError extends Error {
  constructor(message?: string, public actual?: unknown) {
    super(message);
  }
}

export function assert(value: unknown): asserts value {
  if (!isDefined(value)) {
    throw new AssertionError(`The value ${value} is not truthy`, value);
  }
}
