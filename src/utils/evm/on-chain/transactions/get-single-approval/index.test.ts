import BigNumber from 'bignumber.js';

import { EvmAssetStandard } from '../../types';
import {
  aliceAddress,
  approveErc20Data,
  approveErc721Data,
  bobAddress,
  getTestErc721TokenSlug,
  increaseAllowanceErc20Data,
  testErc721Address,
  testNetwork,
  testUsdcAddress,
  testUsdcTokenSlug
} from '../data.mock';
import { mockDetectTokenStandard, mockReadContract } from '../transactions.mock';

import { getSingleApproval } from '.';

describe('getSingleApproval', () => {
  it('should return null if the transaction is not a contract call transaction', async () => {
    const approval = await getSingleApproval(
      { to: testUsdcAddress, data: '0x', value: BigInt(0) },
      aliceAddress,
      testNetwork
    );
    expect(approval).toBeNull();
  });

  it('should return the correct approval amount for erc20 approve', async () => {
    mockDetectTokenStandard.mockResolvedValueOnce(EvmAssetStandard.ERC20);
    const approval = await getSingleApproval(
      { to: testUsdcAddress, data: approveErc20Data },
      aliceAddress,
      testNetwork
    );

    expect(approval).toEqual({
      amount: new BigNumber(15000),
      spender: bobAddress,
      assetSlug: testUsdcTokenSlug,
      standard: EvmAssetStandard.ERC20
    });
  });

  it('should return the correct approval amount for erc20 increase allowance', async () => {
    mockDetectTokenStandard.mockResolvedValueOnce(EvmAssetStandard.ERC20);
    mockReadContract.mockResolvedValue(2000n);
    const approval = await getSingleApproval(
      { to: testUsdcAddress, data: increaseAllowanceErc20Data },
      aliceAddress,
      testNetwork
    );

    expect(approval).toEqual({
      amount: new BigNumber(12000),
      spender: bobAddress,
      assetSlug: testUsdcTokenSlug,
      standard: EvmAssetStandard.ERC20
    });
  });

  it('should return the correct approval amount for erc721 approve', async () => {
    mockDetectTokenStandard.mockResolvedValue(EvmAssetStandard.ERC721);
    const approval = await getSingleApproval(
      { to: testErc721Address, data: approveErc721Data },
      aliceAddress,
      testNetwork
    );

    expect(approval).toEqual({
      amount: new BigNumber(1),
      spender: bobAddress,
      assetSlug: getTestErc721TokenSlug(1),
      standard: EvmAssetStandard.ERC721
    });
    mockDetectTokenStandard.mockReset();
  });
});
