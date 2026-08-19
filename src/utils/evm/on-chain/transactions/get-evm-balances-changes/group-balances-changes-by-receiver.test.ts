import BigNumber from 'bignumber.js';

import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { EvmAssetStandard } from 'src/utils/evm/on-chain/types';

import { bobAddress, carolAddress, testErc721Address, testUsdcAddress, testUsdcTokenSlug } from '../data.mock';

import { groupBalancesChangesByReceiver } from './group-balances-changes-by-receiver';

describe('groupBalancesChangesByReceiver', () => {
  it('groups non-zero changes by receiver and strips zero deltas', () => {
    const groups = groupBalancesChangesByReceiver({
      [EVM_TOKEN_SLUG]: {
        atomicAmount: new BigNumber(-1000),
        standard: EvmAssetStandard.NATIVE,
        receiver: testUsdcAddress
      },
      [testUsdcTokenSlug]: {
        atomicAmount: new BigNumber(-5e18),
        standard: EvmAssetStandard.ERC20,
        receiver: bobAddress
      },
      [testErc721Address.toLowerCase()]: {
        atomicAmount: new BigNumber(0),
        standard: EvmAssetStandard.ERC20,
        receiver: bobAddress
      }
    });

    expect(groups).toHaveLength(2);
    expect(groups[0]).toEqual({
      receiver: testUsdcAddress,
      changes: [{ assetSlug: EVM_TOKEN_SLUG, amount: new BigNumber(-1000), standard: EvmAssetStandard.NATIVE }]
    });
    expect(groups[1]).toEqual({
      receiver: bobAddress,
      changes: [{ assetSlug: testUsdcTokenSlug, amount: new BigNumber(-5e18), standard: EvmAssetStandard.ERC20 }]
    });
  });

  it('keeps multiple assets for the same receiver in one group', () => {
    const groups = groupBalancesChangesByReceiver({
      [testUsdcTokenSlug]: {
        atomicAmount: new BigNumber(-1),
        standard: EvmAssetStandard.ERC20,
        receiver: bobAddress
      },
      [carolAddress.toLowerCase()]: {
        atomicAmount: new BigNumber(-2),
        standard: EvmAssetStandard.ERC20,
        receiver: bobAddress
      }
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].receiver).toBe(bobAddress);
    expect(groups[0].changes).toHaveLength(2);
  });
});
