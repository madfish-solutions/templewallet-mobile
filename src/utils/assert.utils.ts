import { isDefined } from './is-defined';

export class AssertionError extends Error {
  constructor(message?: string, public actual?: unknown) {
    super(message);
  }
}

export function assert(value: unknown, error?: unknown): asserts value {
  if (!isDefined(value)) {
    throw error ?? new AssertionError(`The value ${value} is not truthy`, value);
  }
}
