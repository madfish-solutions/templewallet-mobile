import {
  mockOriginationOperation,
  mockOtherTypesOperations,
  mockTransactionOperation
} from 'src/types/semi-partial-tezos-operation.mock';

import { mapBeaconToTaquitoParams } from './beacon.utils';

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
