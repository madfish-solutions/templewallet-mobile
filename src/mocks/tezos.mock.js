export const mockFA1_2Contract = {
  methods: {
    transfer: jest.fn(),
    approve: jest.fn(),
    getAllowance: jest.fn(),
    getBalance: jest.fn(),
    getTotalSupply: jest.fn()
  },
  parameterSchema: {
    ExtractSignatures: () => [
      ['transfer', 'address', 'address', 'nat'],
      ['approve', 'address', 'nat'],
      ['getAllowance', 'address', 'address', 'contract'],
      ['getBalance', 'address', 'contract'],
      ['getTotalSupply', 'unit', 'contract']
    ]
  }
};

export const mockFA2Contract = {
  methods: {
    update_operators: jest.fn(),
    transfer: jest.fn(),
    balance_of: jest.fn()
  },
  parameterSchema: {
    ExtractSignatures: () => [
      ['update_operators', 'list'],
      ['transfer', 'list'],
      ['balance_of', 'list']
    ]
  }
};

export const mockToolkitMethods = {
  contractAt: jest.fn()
};

const mockTezosToolkit = {
  contract: {
    at: mockToolkitMethods.contractAt
  }
};

jest.mock('@taquito/taquito', () => ({
  TezosToolkit: () => mockTezosToolkit
}));
