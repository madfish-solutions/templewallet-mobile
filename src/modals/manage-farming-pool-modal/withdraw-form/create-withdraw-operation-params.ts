import { MichelsonMap, OpKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { estimateWithdrawTokenOutput } from 'src/apis/quipuswap-staking';
import { PoolType, SingleFarmResponse, TooLowPoolReservesError } from 'src/apis/quipuswap-staking/types';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { convertFarmToken } from 'src/utils/staking.utils';

import { STABLESWAP_REFERRAL, WTEZ_TOKEN } from '../constants';

export const createWithdrawOperationParams = async (
  farm: SingleFarmResponse,
  tokenIndex: number,
  tezos: TezosToolkit,
  accountPkh: string,
  stake: UserStakeValueInterface
) => {
  if (farm.item.type !== PoolType.STABLESWAP) {
    throw new Error('Non-stableswap pools are not supported');
  }

  const { contractAddress: farmAddress, stakedToken } = farm.item;
  const { contractAddress: poolAddress, fa2TokenId: poolId = 0 } = stakedToken;
  const asset = convertFarmToken(farm.item.tokens[tokenIndex]);
  const assetSlug = toTokenSlug(asset.address, asset.id);
  const shouldBurnWtezToken = assetSlug === TEZ_TOKEN_SLUG;
  const farmContract = await getReadOnlyContract(farmAddress, tezos);
  const poolContract = await getReadOnlyContract(poolAddress, tezos);
  const depositAmount = new BigNumber(stake.depositAmountAtomic ?? 0);
  const [tokenOutput] = await estimateWithdrawTokenOutput(tezos, poolContract, [tokenIndex], depositAmount, poolId);

  if (tokenOutput === null) {
    throw new TooLowPoolReservesError();
  }

  if (tokenOutput === undefined) {
    throw new Error('Failed to estimate token output');
  }

  const tokensOutput = new MichelsonMap<BigNumber, BigNumber>();
  tokensOutput.set(new BigNumber(tokenIndex), tokenOutput);

  let burnWTezParams: TransferParams[] = [];
  if (shouldBurnWtezToken) {
    const wTezContract = await getReadOnlyContract(WTEZ_TOKEN.address, tezos);
    burnWTezParams = [wTezContract.methods.burn(accountPkh, accountPkh, tokenOutput).toTransferParams()];
  }

  const withdrawTransferParams = farmContract.methods.withdraw(stake.lastStakeId).toTransferParams();
  const divestOneCoinTransferParams = poolContract.methods
    .divest_imbalanced(poolId, tokensOutput, depositAmount, getTransactionTimeoutDate(), null, STABLESWAP_REFERRAL)
    .toTransferParams();

  return [withdrawTransferParams, divestOneCoinTransferParams, ...burnWTezParams].map(operation => ({
    ...operation,
    kind: OpKind.TRANSACTION as const
  }));
};
