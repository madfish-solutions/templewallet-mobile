export const emptyObject = {};

export const contracts = {
  mainnet: [emptyObject],
  ithacanet: [emptyObject]
};

jest.mock('youves-sdk', () => ({ contracts }));
// jest.mock('youves-sdk/src/networks.mainnet', () => emptyObject);
jest.mock('youves-sdk', () => emptyObject);
jest.mock('youves-sdk/src/staking/unified-staking', () => emptyObject);
// jest.mock('youves-sdk/src/networks.base', () => emptyObject);
