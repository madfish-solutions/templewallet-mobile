import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import { estimateWithdrawTokenOutput, getLiquidityBakingStorage } from 'src/apis/quipuswap-staking';
import { PoolType, SingleFarmResponse, TooLowPoolReservesError } from 'src/apis/quipuswap-staking/types';
import {
  BURN_ADDREESS,
  MAX_ROUTING_FEE_CHAINS,
  ROUTE3_CONTRACT,
  ROUTING_FEE_SLIPPAGE_RATIO,
  TEMPLE_TOKEN,
  ZERO
} from 'src/config/swap';
import { getTransactionTimeoutDate } from 'src/op-params/op-params.utils';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { TEZ_TOKEN_SLUG, WTEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3SwapParams, fetchRoute3Tokens$ } from 'src/utils/route3.util';
import { getReadOnlyContract } from 'src/utils/rpc/contract.utils';
import { convertFarmToken } from 'src/utils/staking.utils';
import { calculateRoutingInputAndFee, getRoutingFeeTransferParams, getSwapTransferParams } from 'src/utils/swap.utils';
import { mutezToTz, tzToMutez } from 'src/utils/tezos.util';
import { parseTransferParamsToParamsWithKind } from 'src/utils/transfer-params.utils';

import { STABLESWAP_REFERRAL } from '../constants';

export const createWithdrawOperationParams = async (
  farm: SingleFarmResponse,
  tokenIndex: number,
  tezos: TezosToolkit,
  accountPkh: string,
  stake: UserStakeValueInterface
) => {
  const { contractAddress: farmAddress, stakedToken } = farm.item;
  const { contractAddress: poolAddress } = stakedToken;
  const poolContract = await getReadOnlyContract(poolAddress, tezos);
  let transferParams: TransferParams[] = [];

  switch (farm.item.type) {
    case PoolType.LIQUIDITY_BAKING:
      const lpAmount = new BigNumber(stake.depositAmountAtomic ?? 0);
      const { xtzPool, tokenPool, lqtTotal } = await getLiquidityBakingStorage(tezos);
      const divestMutezAmount = xtzPool.times(lpAmount).dividedToIntegerBy(lqtTotal);
      const divestTzBTCAmount = tokenPool.times(lpAmount).dividedToIntegerBy(lqtTotal);
      const removeLiquidityParams = poolContract.methods
        .removeLiquidity(accountPkh, lpAmount, divestMutezAmount, divestTzBTCAmount, getTransactionTimeoutDate())
        .toTransferParams({ mutez: true });
      const allTokens = await firstValueFrom(fetchRoute3Tokens$());
      const tezToken = allTokens.find(({ symbol }) => symbol === 'XTZ');
      const tzBTCToken = allTokens.find(({ symbol }) => symbol === 'TZBTC');

      if (!isDefined(tezToken) || !isDefined(tzBTCToken)) {
        throw new Error('Failed to find XTZ or TZBTC token in Route3 tokens list');
      }

      const threeRouteFromToken = tokenIndex === 0 ? tzBTCToken : tezToken;
      const threeRouteToToken = tokenIndex === 0 ? tezToken : tzBTCToken;
      const { swapInputMinusFeeAtomic, routingFeeAtomic } = calculateRoutingInputAndFee(
        tokenIndex === 0 ? divestTzBTCAmount : divestMutezAmount
      );
      const swapToTempleParams = await fetchRoute3SwapParams({
        fromSymbol: threeRouteFromToken.symbol,
        toSymbol: TEMPLE_TOKEN.symbol,
        amount: mutezToTz(routingFeeAtomic, threeRouteFromToken.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });

      const templeOutputAtomic = tzToMutez(new BigNumber(swapToTempleParams.output ?? ZERO), TEMPLE_TOKEN.decimals)
        .multipliedBy(ROUTING_FEE_SLIPPAGE_RATIO)
        .integerValue(BigNumber.ROUND_DOWN);

      const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
      const swapToTempleTokenOpParams = await getSwapTransferParams(
        threeRouteFromToken,
        TEMPLE_TOKEN,
        routingFeeAtomic,
        templeOutputAtomic,
        swapToTempleParams.chains,
        tezos,
        accountPkh,
        swapContract
      );

      const routingFeeOpParams = await getRoutingFeeTransferParams(
        TEMPLE_TOKEN,
        templeOutputAtomic.dividedToIntegerBy(2),
        accountPkh,
        BURN_ADDREESS,
        tezos
      );

      const { chains: swapParamsChains, output: rawSwapOutput } = await fetchRoute3SwapParams({
        fromSymbol: threeRouteFromToken.symbol,
        toSymbol: threeRouteToToken.symbol,
        amount: mutezToTz(swapInputMinusFeeAtomic, threeRouteFromToken.decimals).toFixed(),
        chainsLimit: MAX_ROUTING_FEE_CHAINS
      });

      if (!isDefined(rawSwapOutput) || rawSwapOutput === ZERO.toFixed()) {
        throw new Error(`Cannot swap ${threeRouteFromToken.symbol} to ${threeRouteToToken.symbol}`);
      }

      const threeRouteSwapOpParams = await getSwapTransferParams(
        threeRouteFromToken,
        threeRouteToToken,
        swapInputMinusFeeAtomic,
        tzToMutez(new BigNumber(rawSwapOutput), threeRouteToToken.decimals),
        swapParamsChains,
        tezos,
        accountPkh,
        swapContract
      );

      transferParams = [
        removeLiquidityParams,
        ...swapToTempleTokenOpParams,
        ...routingFeeOpParams,
        ...threeRouteSwapOpParams
      ];
      break;
    case PoolType.STABLESWAP:
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
      throw new Error('Non-stableswap pools are not supported');
  }

  return transferParams.map(parseTransferParamsToParamsWithKind).flat();
};
