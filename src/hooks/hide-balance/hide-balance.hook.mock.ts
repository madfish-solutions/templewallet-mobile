export const useHideBalanceMock = jest.fn();

jest.mock('./hide-balance.hook', () => ({ useHideBalance: useHideBalanceMock }));
