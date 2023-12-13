export {};

jest.mock('mem', () => (fn: EmptyFn) => fn);

jest.mock('memoizee', () => (fn: EmptyFn) => fn);
