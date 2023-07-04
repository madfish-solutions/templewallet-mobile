import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { estimateStableswapLpTokenOutput } from 'src/apis/quipuswap-staking';
import { PoolType, SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { convertFarmToken } from 'src/utils/staking.utils';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { STABLESWAP_REFERRAL } from '../constants';

export const createStakeOperationParams = async (
  farm: SingleFarmResponse,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId?: string
) => {
  if (farm.item.type !== PoolType.STABLESWAP) {
    throw new Error('Non-stableswap pools are not supported');
  }

  const { contractAddress: farmAddress, stakedToken } = farm.item;
  const { contractAddress: poolAddress, fa2TokenId: poolId = 0 } = stakedToken;
  const assetSlug = toTokenSlug(asset.address, asset.id);
  const shouldUseWtezToken = assetSlug === TEZ_TOKEN_SLUG;
  const tokenToInvest = shouldUseWtezToken ? WTEZ_TOKEN_METADATA : asset;
  const [farmContract, poolContract] = await Promise.all(
    [farmAddress, poolAddress].map(async address => getReadOnlyContract(address, tezos))
  );

  let convertToWTezParams: TransferParams[] = [];
  if (shouldUseWtezToken) {
    const wTezContract = await getReadOnlyContract(WTEZ_TOKEN_METADATA.address, tezos);
    convertToWTezParams = [
      wTezContract.methods.mint(accountPkh).toTransferParams({ amount: amount.toNumber(), mutez: true })
    ];
  }

  const tokenIndex = farm.item.tokens
    .map(convertFarmToken)
    .findIndex(farmToken => toTokenSlug(farmToken.address, farmToken.id) === assetSlug);
  const michelsonAmounts = new MichelsonMap<number, BigNumber>();
  michelsonAmounts.set(tokenIndex, amount);

  const lpAmount = await estimateStableswapLpTokenOutput(tezos, poolAddress, tokenIndex, amount, poolId);

  const investTransferParams = poolContract.methods
    .invest(stakedToken.fa2TokenId, lpAmount, michelsonAmounts, getTransactionTimeoutDate(), null, STABLESWAP_REFERRAL)
    .toTransferParams();

  const depositTransferParams = farmContract.methods.deposit(new BigNumber(stakeId ?? 0), lpAmount).toTransferParams();

  const { approve: approveAsset, revoke: revokeAsset } = await getTransferPermissions(
    tezos,
    poolAddress,
    accountPkh,
    {
      standard:
        tokenToInvest.standard === TokenStandardsEnum.Fa2 ? Route3TokenStandardEnum.fa2 : Route3TokenStandardEnum.fa12,
      contract: tokenToInvest.address,
      tokenId: tokenToInvest.id.toString()
    },
    amount
  );
  const { approve: approveLp, revoke: revokeLp } = await getTransferPermissions(
    tezos,
    farmAddress,
    accountPkh,
    {
      standard: Route3TokenStandardEnum.fa2,
      contract: poolAddress,
      tokenId: stakedToken.fa2TokenId?.toString() ?? null
    },
    lpAmount
  );

  return [
    ...approveAsset,
    ...approveLp,
    ...convertToWTezParams,
    investTransferParams,
    depositTransferParams,
    ...revokeLp,
    ...revokeAsset
  ]
    .map(parseTransferParamsToParamsWithKind)
    .flat();
};