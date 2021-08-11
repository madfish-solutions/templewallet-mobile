import { TezosToolkit } from '@taquito/taquito';

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

const mockRpcClient = {
  getBlock: jest.fn(),
  getScript: jest.fn(),
  getManagerKey: jest.fn(),
  getStorage: jest.fn(),
  getBlockHeader: jest.fn(),
  getBlockMetadata: jest.fn(),
  getContract: jest.fn(),
  getEntrypoints: jest.fn(),
  forgeOperations: jest.fn(),
  injectOperation: jest.fn(),
  preapplyOperations: jest.fn()
};

export const mockToolkitMethods = {
  contractAt: jest.fn()
};

mockRpcClient.getContract.mockResolvedValue({ counter: 0 });
mockRpcClient.getBlockHeader.mockResolvedValue({ hash: 'test' });
mockRpcClient.preapplyOperations.mockResolvedValue([]);
mockRpcClient.getBlockMetadata.mockResolvedValue({ next_protocol: 'test_proto' });

// Required for operations confirmation polling
mockRpcClient.getBlock.mockResolvedValue({
  operations: [[{ hash: 'test' }], [], [], []],
  header: {
    level: 0
  }
});

mockRpcClient.getManagerKey.mockResolvedValue('test');
export const mockTezosToolkit = new TezosToolkit('url');
mockTezosToolkit._context.rpc = mockRpcClient;
mockTezosToolkit.contract.at = mockToolkitMethods.contractAt;
