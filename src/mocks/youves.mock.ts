const emptyObject = {};

jest.mock('@temple-wallet/youves-sdk/src/networks.mainnet', () => emptyObject);
jest.mock('@temple-wallet/youves-sdk/src/staking/unified-staking', () => emptyObject);
