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
      ['transfer', 'address', 'pair'],
      ['approve', 'address', 'nat'],
      ['getAllowance', 'address', 'address', 'contract'],
      ['getBalance', 'address', 'contract'],
      ['getTotalSupply', 'unit', 'contract']
    ]
  }
};

export const mockFA2Contract = {
  address: 'FA2ContractAddress',
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
  },
  setPackerProvider: jest.fn(),
  setForgerProvider: jest.fn(),
  setSignerProvider: jest.fn(),
  getFactory: jest.fn(() => () => ({})),
  addExtension: jest.fn(),
  tz: {
    getBalance: jest.fn(() => Promise.resolve('mocked-balance'))
  }
};

jest.mock('@taquito/taquito', () => ({
  ...jest.requireActual('@taquito/taquito'),
  TezosToolkit: () => mockTezosToolkit,
  MichelCodecPacker: () => ({}),
  CompositeForger: () => ({}),
  RpcForger: () => ({})
}));
