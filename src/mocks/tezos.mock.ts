export const mockFA1_2Contract = {
  methodsObject: {
    transfer: jest.fn(),
    approve: jest.fn(),
    getAllowance: jest.fn(),
    getBalance: jest.fn(),
    getTotalSupply: jest.fn()
  },
  parameterSchema: {
    generateSchema: () => ({
      __michelsonType: 'or',
      schema: {
        approve: {
          __michelsonType: 'pair',
          schema: {
            spender: { __michelsonType: 'address', schema: 'address' },
            value: { __michelsonType: 'nat', schema: 'nat' }
          }
        },
        getAllowance: {
          __michelsonType: 'pair',
          schema: {
            '2': {
              __michelsonType: 'contract',
              schema: {
                parameter: { __michelsonType: 'nat', schema: 'nat' }
              }
            },
            owner: { __michelsonType: 'address', schema: 'address' },
            spender: { __michelsonType: 'address', schema: 'address' }
          }
        },
        getBalance: {
          __michelsonType: 'pair',
          schema: {
            '0': { __michelsonType: 'address', schema: 'address' },
            '1': {
              __michelsonType: 'contract',
              schema: {
                parameter: { __michelsonType: 'nat', schema: 'nat' }
              }
            }
          }
        },
        getTotalSupply: {
          __michelsonType: 'pair',
          schema: {
            '0': { __michelsonType: 'unit', schema: 'unit' },
            '1': {
              __michelsonType: 'contract',
              schema: {
                parameter: { __michelsonType: 'nat', schema: 'nat' }
              }
            }
          }
        },
        transfer: {
          __michelsonType: 'pair',
          schema: {
            from: { __michelsonType: 'address', schema: 'address' },
            to: { __michelsonType: 'address', schema: 'address' },
            value: { __michelsonType: 'nat', schema: 'nat' }
          }
        }
      }
    })
  }
};

export const mockFA2Contract = {
  address: 'FA2ContractAddress',
  methodsObject: {
    update_operators: jest.fn(),
    transfer: jest.fn(),
    balance_of: jest.fn()
  },
  parameterSchema: {
    generateSchema: () => ({
      __michelsonType: 'or',
      schema: {
        balance_of: {
          __michelsonType: 'pair',
          schema: {
            requests: {
              __michelsonType: 'list',
              schema: {
                __michelsonType: 'pair',
                schema: {
                  owner: { __michelsonType: 'address', schema: 'address' },
                  token_id: { __michelsonType: 'nat', schema: 'nat' }
                }
              }
            },
            callback: {
              __michelsonType: 'contract',
              schema: {
                parameter: {
                  __michelsonType: 'list',
                  schema: {
                    __michelsonType: 'pair',
                    schema: {
                      request: {
                        __michelsonType: 'pair',
                        schema: {
                          owner: {
                            __michelsonType: 'address',
                            schema: 'address'
                          },
                          token_id: { __michelsonType: 'nat', schema: 'nat' }
                        }
                      },
                      balance: { __michelsonType: 'nat', schema: 'nat' }
                    }
                  }
                }
              }
            }
          }
        },
        transfer: {
          __michelsonType: 'list',
          schema: {
            __michelsonType: 'pair',
            schema: {
              from_: { __michelsonType: 'address', schema: 'address' },
              txs: {
                __michelsonType: 'list',
                schema: {
                  __michelsonType: 'pair',
                  schema: {
                    to_: { __michelsonType: 'address', schema: 'address' },
                    token_id: { __michelsonType: 'nat', schema: 'nat' },
                    amount: { __michelsonType: 'nat', schema: 'nat' }
                  }
                }
              }
            }
          }
        },
        update_operators: {
          __michelsonType: 'list',
          schema: {
            __michelsonType: 'or',
            schema: {
              add_operator: {
                __michelsonType: 'pair',
                schema: {
                  owner: { __michelsonType: 'address', schema: 'address' },
                  operator: { __michelsonType: 'address', schema: 'address' },
                  token_id: { __michelsonType: 'nat', schema: 'nat' }
                }
              },
              remove_operator: {
                __michelsonType: 'pair',
                schema: {
                  owner: { __michelsonType: 'address', schema: 'address' },
                  operator: { __michelsonType: 'address', schema: 'address' },
                  token_id: { __michelsonType: 'nat', schema: 'nat' }
                }
              }
            }
          }
        }
      }
    })
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
