import {
  mockContractCallParams,
  mockDelegationParams,
  mockFA1_2ApproveParams,
  mockFA1_2TokenTransferParams,
  mockFA_2TokenTransferParams,
  mockOriginationParams,
  mockTezosTransferParams
} from '../interfaces/op-params.interface.mock';

import { getParamPreview } from './param-preview.utils';

describe('getParamPreview', () => {
  it('should parse delegation operation', () => {
    expect(getParamPreview(mockDelegationParams)).toMatchSnapshot();
  });

  it('should parse transfer of TEZ', () => {
    expect(getParamPreview(mockTezosTransferParams)).toMatchSnapshot();
  });

  it('should parse transfer of FA1.2 token', () => {
    expect(getParamPreview(mockFA1_2TokenTransferParams)).toMatchSnapshot();
  });

  it('should parse transfer of FA2 token', () => {
    expect(getParamPreview(mockFA_2TokenTransferParams)).toMatchSnapshot();
  });

  it('should parse approval of FA1.2 token expense', () => {
    expect(getParamPreview(mockFA1_2ApproveParams)).toMatchSnapshot();
  });

  it('should provide a fallback for contract calls', () => {
    expect(getParamPreview(mockContractCallParams)).toMatchSnapshot();
  });

  it('should provide a fallback for other operations', () => {
    expect(getParamPreview(mockOriginationParams)).toMatchSnapshot();
  });
});
