import { isDefined } from './is-defined';

export class AssertionError extends Error {
  constructor(message?: string, public actual?: unknown) {
    super(message);
  }
}

export function assert(value: unknown, error?: string | Error): asserts value {
  if (!isDefined(value)) {
    throw error instanceof Error ? error : new AssertionError(error ?? `The value ${value} is not truthy`);
  }
}
