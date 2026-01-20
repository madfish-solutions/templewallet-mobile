import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { estimateStableswapLpTokenOutput } from 'src/apis/quipuswap-staking';
import { StableswapFarm, StableswapPoolVersion } from 'src/apis/quipuswap-staking/types';
import { Route3TokenStandardEnum } from 'src/enums/route3.enum';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenStandardsEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { getTransferPermissions } from 'src/utils/transfer-permissions.util';

import { STABLESWAP_REFERRAL } from '../constants';
import { getYupanaRebalanceParams } from '../utils';

export const createStableswapStakeTransfersParams = async (
  farm: StableswapFarm,
  amount: BigNumber,
  asset: TokenInterface,
  tezos: TezosToolkit,
  accountPkh: string,
  stakeId?: string
) => {
  const { contractAddress: farmAddress, stakedToken, stableswapPoolVersion, tokens } = farm;
  const { contractAddress: poolAddress, fa2TokenId: poolId = 0 } = stakedToken;
  const assetSlug = toTokenSlug(asset.address, asset.id);
  const shouldUseWtezToken = assetSlug === TEZ_TOKEN_SLUG;
  const tokenToInvest = shouldUseWtezToken ? WTEZ_TOKEN_METADATA : asset;
  const [farmContract, poolContract] = await Promise.all(
    [farmAddress, poolAddress].map(async address => getReadOnlyContract(address, tezos))
  );

  const yupanaRebalanceParams =
    stableswapPoolVersion === StableswapPoolVersion.V2
      ? await getYupanaRebalanceParams({
          tezos,
          stableswapContractAddress: poolAddress,
          stableswapPoolId: poolId,
          tokensInPool: tokens.length
        })
      : [];

  let convertToWTezParams: TransferParams[] = [];
  if (shouldUseWtezToken) {
    const wTezContract = await getReadOnlyContract(WTEZ_TOKEN_METADATA.address, tezos);
    convertToWTezParams = [
      wTezContract.methodsObject.mint(accountPkh).toTransferParams({ amount: amount.toNumber(), mutez: true })
    ];
  }

  const tokenIndex = farm.tokens.findIndex(
    farmToken => toTokenSlug(farmToken.contractAddress, farmToken.fa2TokenId) === assetSlug
  );
  const michelsonAmounts = new MichelsonMap<number, BigNumber>();
  michelsonAmounts.set(tokenIndex, amount);

  const lpAmount = await estimateStableswapLpTokenOutput(tezos, poolAddress, tokenIndex, amount, poolId);

  const investTransferParams = poolContract.methodsObject
    .invest({
      pool_id: stakedToken.fa2TokenId,
      shares: lpAmount,
      in_amounts: michelsonAmounts,
      deadline: getTransactionTimeoutDate(),
      receiver: null,
      referral: STABLESWAP_REFERRAL
    })
    .toTransferParams();

  const depositTransferParams = farmContract.methodsObject
    .deposit({ stake_id: new BigNumber(stakeId ?? 0), token_amount: lpAmount })
    .toTransferParams();

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
    ...yupanaRebalanceParams,
    ...approveAsset,
    ...approveLp,
    ...convertToWTezParams,
    investTransferParams,
    depositTransferParams,
    ...revokeLp,
    ...revokeAsset
  ];
};
