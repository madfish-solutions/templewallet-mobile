export {};

jest.mock('memoizee', () => (fn: EmptyFn) => fn);
