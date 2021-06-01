export class AssertionError extends Error {
  constructor(message?: string, public actual?: unknown) {
    super(message);
  }
}

export default function assert(value: unknown): asserts value {
  if (!value) {
    throw new AssertionError(`The value ${value} is not truthy`, value);
  }
}
