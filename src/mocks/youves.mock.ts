export const emptyObject = {};

jest.mock('youves-sdk/src/networks.mainnet', () => emptyObject);
jest.mock('youves-sdk/src/staking/unified-staking', () => emptyObject);
