import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { calculateUnstakeParams } from 'src/apis/liquidity-baking';
import { estimateWithdrawTokenOutput } from 'src/apis/quipuswap-staking';
import { TooLowPoolReservesError } from 'src/apis/quipuswap-staking/types';
import { ROUTE3_CONTRACT, ROUTING_FEE_ADDRESS } from 'src/config/swap';
import { FarmPoolTypeEnum } from 'src/enums/farm-pool-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { SingleFarmResponse } from 'src/types/single-farm-response';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { convertFarmToken } from 'src/utils/staking.utils';
import { getSwapTransferParams } from 'src/utils/swap.utils';
import { getTransferParams$, parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { STABLESWAP_REFERRAL } from '../constants';

export const createWithdrawOperationParams = async (
  farm: SingleFarmResponse,
  tokenIndex: number,
  tezos: TezosToolkit,
  account: AccountInterface,
  stake: UserStakeValueInterface,
  slippageTolerancePercentage: number,
  lpAmount?: BigNumber
) => {
  const { publicKeyHash: accountPkh } = account;
  const { contractAddress: farmAddress, stakedToken } = farm.item;
  const poolAddress = farm.item.type === FarmPoolTypeEnum.LIQUIDITY_BAKING ? farmAddress : stakedToken.contractAddress;
  const poolContract = await getReadOnlyContract(poolAddress, tezos);
  let transferParams: TransferParams[] = [];

  switch (farm.item.type) {
    case FarmPoolTypeEnum.LIQUIDITY_BAKING:
      const lpAmountWithDefault = lpAmount ?? new BigNumber(stake.depositAmountAtomic ?? 0);
      const { divestMutezAmount, divestTzBTCAmount, outputTokenIndexDependentParams } = await calculateUnstakeParams(
        tezos,
        [tokenIndex],
        lpAmountWithDefault,
        slippageTolerancePercentage
      );
      const [
        {
          threeRouteFromToken,
          threeRouteToToken,
          swapToOutputTokenInput,
          routingFeeAtomic,
          swapParamsChains,
          swapOutputAtomic
        }
      ] = outputTokenIndexDependentParams;

      const removeLiquidityParams = poolContract.methods
        .removeLiquidity(
          accountPkh,
          lpAmountWithDefault,
          divestMutezAmount,
          divestTzBTCAmount,
          getTransactionTimeoutDate()
        )
        .toTransferParams({ mutez: true });

      const transferDevFeeParams = await firstValueFrom(
        getTransferParams$(
          { address: threeRouteFromToken.contract ?? '', id: 0 },
          tezos.rpc.getRpcUrl(),
          account,
          ROUTING_FEE_ADDRESS,
          routingFeeAtomic
        )
      );

      const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
      const threeRouteSwapOpParams = await getSwapTransferParams(
        threeRouteFromToken,
        threeRouteToToken,
        swapToOutputTokenInput,
        swapOutputAtomic,
        swapParamsChains,
        tezos,
        accountPkh,
        swapContract
      );

      transferParams = [removeLiquidityParams, transferDevFeeParams, ...threeRouteSwapOpParams];
      break;
    case FarmPoolTypeEnum.STABLESWAP:
      const { fa2TokenId: poolId = 0 } = stakedToken;
      const asset = convertFarmToken(farm.item.tokens[tokenIndex]);
      const assetSlug = toTokenSlug(asset.address, asset.id);
      const shouldBurnWtezToken = assetSlug === TEZ_TOKEN_SLUG;
      const farmContract = await getReadOnlyContract(farmAddress, tezos);
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
        const wTezContract = await getReadOnlyContract(WTEZ_TOKEN_METADATA.address, tezos);
        burnWTezParams = [wTezContract.methods.burn(accountPkh, accountPkh, tokenOutput).toTransferParams()];
      }

      const withdrawTransferParams = farmContract.methods.withdraw(stake.lastStakeId).toTransferParams();
      const divestOneCoinTransferParams = poolContract.methods
        .divest_imbalanced(poolId, tokensOutput, depositAmount, getTransactionTimeoutDate(), null, STABLESWAP_REFERRAL)
        .toTransferParams();

      transferParams = [withdrawTransferParams, divestOneCoinTransferParams, ...burnWTezParams];
      break;
    default:
      throw new Error('Unsupported farm type');
  }

  return transferParams.map(parseTransferParamsToParamsWithKind).flat();
};
