export {};

jest.mock('./hide-balance.hook', () => ({ useHideBalance: jest.fn() }));
