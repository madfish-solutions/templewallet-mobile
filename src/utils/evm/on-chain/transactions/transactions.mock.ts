export const mockDetectTokenStandard = jest.fn();
export const mockSimulateContract = jest.fn();
export const mockReadContract = jest.fn();

jest.mock('../common.utils', () => ({
  detectTokenStandard: mockDetectTokenStandard
}));

jest.mock('src/utils/rpc/evm-client.utils', () => ({
  ...jest.requireActual('src/utils/rpc/evm-client.utils'),
  getViemPublicClient: () => ({
    simulateContract: mockSimulateContract,
    readContract: mockReadContract
  })
}));
