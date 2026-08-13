import {
  mockOriginationOperation,
  mockOtherTypesOperations,
  mockTransactionOperation
} from 'src/types/semi-partial-tezos-operation.mock';

import { isWalletConnectPairing, isWalletConnectPayload, mapBeaconToTaquitoParams } from './beacon.utils';

describe('mapBeaconToTaquitoParams', () => {
  it('should map origination params correctly', () => {
    expect(mapBeaconToTaquitoParams(mockOriginationOperation)).toMatchSnapshot();
  });

  it('should map transaction params correctly', () => {
    expect(mapBeaconToTaquitoParams(mockTransactionOperation)).toMatchSnapshot();
  });

  it('should map params of other kinds correctly', () => {
    expect(mockOtherTypesOperations.map(mapBeaconToTaquitoParams)).toMatchSnapshot();
  });
});

describe('isWalletConnectPayload', () => {
  it('should detect WalletConnect URIs', () => {
    expect(isWalletConnectPayload('wc:abc@2?relay-protocol=irn&symKey=def')).toBe(true);
  });

  it('should ignore Beacon pairing links', () => {
    expect(isWalletConnectPayload('tezos://?type=tzip10&data=abc')).toBe(false);
  });
});

describe('isWalletConnectPairing', () => {
  it('should detect walletconnect-pairing-request peers', () => {
    expect(
      isWalletConnectPairing({
        type: 'walletconnect-pairing-request',
        name: 'dApp',
        publicKey: '00',
        uri: 'wc:abc@2'
      })
    ).toBe(true);
  });

  it('should detect peers with a wc: uri', () => {
    expect(isWalletConnectPairing({ name: 'dApp', publicKey: '00', uri: 'wc:abc@2' })).toBe(true);
  });

  it('should ignore P2P Beacon peers', () => {
    expect(
      isWalletConnectPairing({
        name: 'dApp',
        publicKey: '00',
        relayServer: 'beacon-node.example.com'
      })
    ).toBe(false);
  });
});
