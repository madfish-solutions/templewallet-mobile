import { TezosOperationType } from '@airgap/beacon-sdk';

import { mapBeaconToTaquitoParams, SemiPartialTezosOperation } from './beacon.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('mapBeaconToTaquitoParams', () => {
  it('should map origination params correctly', () => {
    expect(
      mapBeaconToTaquitoParams({
        kind: TezosOperationType.ORIGINATION,
        balance: '0',
        script: { code: 'mockCode', storage: 'mockStorage' } as any,
        fee: '1',
        gas_limit: '2',
        storage_limit: '3',
        source: 'account1',
        counter: '100000'
      })
    ).toMatchSnapshot();
  });

  it('should map transaction params correctly', () => {
    expect(
      mapBeaconToTaquitoParams({
        kind: TezosOperationType.TRANSACTION,
        amount: '0',
        destination: 'account1',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3',
        source: 'account1',
        counter: '100000',
        parameters: {
          entrypoint: 'mockEntrypoint',
          value: { int: '3' }
        }
      })
    ).toMatchSnapshot();
  });

  it('should map params of other kinds correctly', () => {
    const otherTypesTransactions: SemiPartialTezosOperation[] = [
      {
        kind: TezosOperationType.ACTIVATE_ACCOUNT,
        pkh: 'account1',
        secret: 'mockSecret',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.BALLOT,
        source: 'account1',
        period: '4',
        proposal: 'mockProposal',
        ballot: 'yay',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.DELEGATION,
        delegate: 'mockDelegate',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.ENDORSEMENT,
        level: '666',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.PROPOSALS,
        period: '4',
        proposals: ['mockProposal'],
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.REVEAL,
        public_key: 'mockPublicKey',
        fee: '1',
        gas_limit: '2',
        storage_limit: '3'
      },
      {
        kind: TezosOperationType.SEED_NONCE_REVELATION,
        level: '666',
        nonce: '667'
      }
    ];

    expect(otherTypesTransactions.map(mapBeaconToTaquitoParams)).toMatchSnapshot();
  });
});
