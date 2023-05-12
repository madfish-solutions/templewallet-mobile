import { OpKind } from '@taquito/rpc';
import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getStableswapPool } from 'src/apis/quipuswap';
import { PoolType, SingleFarmResponse } from 'src/apis/quipuswap/types';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { changeByPercentage } from 'src/utils/number.util';
import { convertFarmToken } from 'src/utils/staking.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { STABLESWAP_REFERRAL, WTEZ_TOKEN } from '../constants';

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
  const { contractAddress: poolAddress } = stakedToken;
  const assetSlug = toTokenSlug(asset.address, asset.id);
  const shouldUseWtezToken = assetSlug === TEZ_TOKEN_SLUG;
  const tokenToInvest = shouldUseWtezToken ? WTEZ_TOKEN : asset;
  const farmContract = await tezos.contract.at(farmAddress);
  const poolContract = await tezos.contract.at(poolAddress);

  let convertToWTezParams: TransferParams[] = [];
  if (shouldUseWtezToken) {
    const wTezContract = await tezos.contract.at(WTEZ_TOKEN.address);
    convertToWTezParams = [
      wTezContract.methods.mint(accountPkh).toTransferParams({ amount: amount.toNumber(), mutez: true })
    ];
  }

  const michelsonAmounts = new MichelsonMap<number, BigNumber>();
  michelsonAmounts.set(
    farm.item.tokens
      .map(convertFarmToken)
      .findIndex(farmToken => toTokenSlug(farmToken.address, farmToken.id) === assetSlug),
    amount
  );
  const lpAmountWithoutFees = await poolContract.contractViews
    .calc_token_amount({
      pool_id: stakedToken.fa2TokenId,
      amounts: michelsonAmounts,
      is_deposit: true
    })
    .executeView({ viewCaller: accountPkh });
  const { item: stableswapPool } = await getStableswapPool(farm.item.stableswapPoolId, farm.item.stableswapPoolVersion);
  const { devFee, stakersFee, interfaceFee, liquidityProvidersFee } = stableswapPool.fees;
  const lpAmount = changeByPercentage(
    lpAmountWithoutFees,
    BigNumber.sum(devFee, stakersFee, interfaceFee, liquidityProvidersFee).negated()
  ).integerValue(BigNumber.ROUND_DOWN);

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
  ].map(operation => ({ ...operation, kind: OpKind.TRANSACTION as const }));
};
