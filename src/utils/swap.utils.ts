import { MichelsonMap, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom, map } from 'rxjs';

import { ONE_MINUTE } from 'src/config/fixed-times';
import {
  APP_ID,
  ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT,
  CASHBACK_RATIO,
  ROUTE3_CONTRACT,
  ROUTING_FEE_RATIO,
  SIRS_LIQUIDITY_SLIPPAGE_RATIO
} from 'src/config/swap';
import {
  Hop,
  isSwapHops,
  Route3Hop,
  Route3LiquidityBakingHops,
  Route3SwapHops,
  Route3Token
} from 'src/interfaces/route3.interface';
import {
  THREE_ROUTE_SIRS_TOKEN,
  THREE_ROUTE_TZBTC_TOKEN,
  THREE_ROUTE_XTZ_TOKEN
} from 'src/token/data/three-route-tokens';
import { LIQUIDITY_BAKING_DEX_ADDRESS } from 'src/token/data/token-slugs';

import { isDefined } from './is-defined';
import { ZERO } from './number.util';
import { getReadOnlyContract } from './rpc/contract.utils';
import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';
import { tzToMutez } from './tezos.util';
import { getTransferParams$ } from './transfer-params.utils';
import { getTransferPermissions } from './transfer-permissions.util';

export const getLbStorage = async (tezosOrRpc: string | TezosToolkit) => {
  const tezos = typeof tezosOrRpc === 'string' ? createReadOnlyTezosToolkit(tezosOrRpc) : tezosOrRpc;
  const contract = await getReadOnlyContract(LIQUIDITY_BAKING_DEX_ADDRESS, tezos);

  return contract.storage<{ tokenPool: BigNumber; xtzPool: BigNumber; lqtTotal: BigNumber }>();
};

const mapToRoute3ExecuteHops = (hops: Route3Hop[]): MichelsonMap<string, Hop> => {
  const result = new MichelsonMap<string, Hop>();

  hops.forEach(({ dexId, tokenInAmount, tradingBalanceAmount, code, params }, index) =>
    result.set(index.toString(), {
      dex_id: dexId,
      code,
      amount_from_token_in_reserves: new BigNumber(tokenInAmount),
      amount_from_trading_balance: new BigNumber(tradingBalanceAmount),
      params: params ?? ''
    })
  );

  return result;
};

export const calculateSidePaymentsFromInput = (inputAmount: BigNumber | undefined) => {
  const swapInputAtomic = (inputAmount ?? ZERO).integerValue(BigNumber.ROUND_DOWN);
  const shouldTakeFeeFromInput = swapInputAtomic.gte(ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT);
  const inputFeeAtomic = shouldTakeFeeFromInput
    ? swapInputAtomic.times(ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_CEIL)
    : ZERO;
  const cashbackSwapInputAtomic = shouldTakeFeeFromInput ? swapInputAtomic.times(CASHBACK_RATIO).integerValue() : ZERO;
  const swapInputMinusFeeAtomic = swapInputAtomic.minus(inputFeeAtomic);

  return {
    inputFeeAtomic,
    cashbackSwapInputAtomic,
    swapInputMinusFeeAtomic
  };
};

export const calculateOutputFeeAtomic = (inputAmount: BigNumber | undefined, outputAmount: BigNumber) => {
  const swapInputAtomic = (inputAmount ?? ZERO).integerValue(BigNumber.ROUND_DOWN);

  return swapInputAtomic.gte(ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT)
    ? ZERO
    : outputAmount.times(ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_CEIL);
};

export const getRoutingFeeTransferParams = async (
  token: Route3Token,
  feeAmountAtomic: BigNumber,
  senderPublicKeyHash: string,
  routingFeeAddress: string,
  tezos: TezosToolkit
) =>
  feeAmountAtomic.gt(ZERO)
    ? firstValueFrom(
        getTransferParams$(
          { address: token.contract ?? '', id: Number(token.tokenId ?? 0) },
          tezos,
          senderPublicKeyHash,
          routingFeeAddress,
          feeAmountAtomic
        ).pipe(map(params => [params]))
      )
    : Promise.resolve([]);

export const getSwapTransferParams = async (
  fromRoute3Token: Route3Token,
  toRoute3Token: Route3Token,
  inputAmountAtomic: BigNumber,
  expectedReceivedAtomic: BigNumber,
  slippageRatio: number,
  chains: Route3LiquidityBakingHops | Route3SwapHops,
  tezos: TezosToolkit,
  accountPkh: string
) => {
  const minimumReceivedAtomic = multiplyAtomicAmount(expectedReceivedAtomic, slippageRatio, BigNumber.ROUND_FLOOR);
  let burnSirsParams: TransferParams[] = [];
  let approvesParams: TransferParams[];
  let swapParams: TransferParams[];
  let revokesParams: TransferParams[];
  let mintSirsParams: TransferParams[] = [];

  const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
  const lbDexContract = await getReadOnlyContract(LIQUIDITY_BAKING_DEX_ADDRESS, tezos);
  if (isSwapHops(chains)) {
    const swapMethod = swapContract.methodsObject.execute({
      token_in_id: fromRoute3Token.id,
      token_out_id: toRoute3Token.id,
      min_out: minimumReceivedAtomic,
      receiver: accountPkh,
      hops: mapToRoute3ExecuteHops(chains.hops),
      app_id: APP_ID
    });

    swapParams = [
      swapMethod.toTransferParams({
        amount: fromRoute3Token.symbol.toLowerCase() === 'xtz' ? inputAmountAtomic.toNumber() : 0,
        mutez: true
      })
    ];

    const { approve, revoke } = await getTransferPermissions(
      tezos,
      ROUTE3_CONTRACT,
      accountPkh,
      fromRoute3Token,
      inputAmountAtomic
    );
    approvesParams = approve;
    revokesParams = revoke;
  } else if (fromRoute3Token.id === THREE_ROUTE_SIRS_TOKEN.id) {
    const xtzFromBurnAmount = tzToMutez(chains.xtzTree.tokenInAmount, THREE_ROUTE_XTZ_TOKEN.decimals);
    const tzbtcFromBurnAmount = tzToMutez(chains.tzbtcTree.tokenInAmount, THREE_ROUTE_TZBTC_TOKEN.decimals);
    burnSirsParams = [
      lbDexContract.methodsObject
        .removeLiquidity({
          to: accountPkh,
          lqtBurned: inputAmountAtomic,
          minXtzWithdrawn: xtzFromBurnAmount,
          minTokensWithdrawn: tzbtcFromBurnAmount,
          deadline: Math.floor(Date.now() / 1000) + ONE_MINUTE
        })
        .toTransferParams()
    ];

    const { approve: approveTzbtc, revoke: revokeTzbtc } = await getTransferPermissions(
      tezos,
      ROUTE3_CONTRACT,
      accountPkh,
      THREE_ROUTE_TZBTC_TOKEN,
      tzbtcFromBurnAmount
    );
    approvesParams = approveTzbtc;
    revokesParams = revokeTzbtc;
    swapParams = [];
    const xtzSwapOut = tzToMutez(chains.xtzTree.tokenOutAmount, toRoute3Token.decimals);
    const tzbtcSwapOut = tzToMutez(chains.tzbtcTree.tokenOutAmount, toRoute3Token.decimals);
    if (chains.tzbtcHops.length > 0) {
      const tzbtcSwapMethod = swapContract.methodsObject.execute({
        token_in_id: THREE_ROUTE_TZBTC_TOKEN.id,
        token_out_id: toRoute3Token.id,
        min_out: multiplyAtomicAmount(tzbtcSwapOut, slippageRatio, BigNumber.ROUND_FLOOR),
        receiver: accountPkh,
        hops: mapToRoute3ExecuteHops(chains.tzbtcHops),
        app_id: APP_ID
      });
      swapParams.push(tzbtcSwapMethod.toTransferParams());
    }
    if (chains.xtzHops.length > 0) {
      const xtzSwapMethod = swapContract.methodsObject.execute({
        token_in_id: THREE_ROUTE_XTZ_TOKEN.id,
        token_out_id: toRoute3Token.id,
        min_out: multiplyAtomicAmount(xtzSwapOut, slippageRatio, BigNumber.ROUND_FLOOR),
        receiver: accountPkh,
        hops: mapToRoute3ExecuteHops(chains.xtzHops),
        app_id: APP_ID
      });
      swapParams.push(xtzSwapMethod.toTransferParams({ amount: Number(chains.xtzTree.tokenInAmount), mutez: false }));
    }
  } else {
    const { approve: approveInputToken, revoke: revokeInputToken } = await getTransferPermissions(
      tezos,
      ROUTE3_CONTRACT,
      accountPkh,
      fromRoute3Token,
      inputAmountAtomic
    );
    approvesParams = approveInputToken;
    revokesParams = revokeInputToken;
    swapParams = [];
    const xtzSwapOut = tzToMutez(chains.xtzTree.tokenOutAmount, THREE_ROUTE_XTZ_TOKEN.decimals);
    const tzbtcSwapOut = tzToMutez(chains.tzbtcTree.tokenOutAmount, THREE_ROUTE_TZBTC_TOKEN.decimals);
    const xtzIsSwapped = chains.xtzHops.length > 0;
    const tzbtcIsSwapped = chains.tzbtcHops.length > 0;
    const xtzSwapMinOut = xtzIsSwapped
      ? multiplyAtomicAmount(xtzSwapOut, slippageRatio, BigNumber.ROUND_FLOOR)
      : xtzSwapOut;
    const tzbtcAddLiqInput = tzbtcIsSwapped
      ? multiplyAtomicAmount(tzbtcSwapOut, slippageRatio, BigNumber.ROUND_FLOOR)
      : tzbtcSwapOut;
    if (xtzIsSwapped) {
      const xtzSwapMethod = swapContract.methodsObject.execute({
        token_in_id: fromRoute3Token.id,
        token_out_id: THREE_ROUTE_XTZ_TOKEN.id,
        min_out: xtzSwapMinOut,
        receiver: accountPkh,
        hops: mapToRoute3ExecuteHops(chains.xtzHops),
        app_id: APP_ID
      });
      swapParams.push(xtzSwapMethod.toTransferParams());
    }
    if (tzbtcIsSwapped) {
      const tzbtcSwapMethod = swapContract.methodsObject.execute({
        token_in_id: fromRoute3Token.id,
        token_out_id: THREE_ROUTE_TZBTC_TOKEN.id,
        min_out: tzbtcAddLiqInput,
        receiver: accountPkh,
        hops: mapToRoute3ExecuteHops(chains.tzbtcHops),
        app_id: APP_ID
      });
      swapParams.push(
        tzbtcSwapMethod.toTransferParams({
          amount: fromRoute3Token.id === THREE_ROUTE_XTZ_TOKEN.id ? Number(chains.tzbtcTree.tokenInAmount) : 0,
          mutez: false
        })
      );
    }

    const { approve: approveTzbtc, revoke: revokeTzbtc } = await getTransferPermissions(
      tezos,
      LIQUIDITY_BAKING_DEX_ADDRESS,
      accountPkh,
      THREE_ROUTE_TZBTC_TOKEN,
      tzbtcAddLiqInput
    );
    // Prevent extra TEZ spending
    const { xtzPool, lqtTotal } = await getLbStorage(tezos);
    const xtzAddLiqInput = BigNumber.min(
      xtzSwapMinOut,
      xtzPool
        .times(expectedReceivedAtomic)
        .div(lqtTotal)
        .div(SIRS_LIQUIDITY_SLIPPAGE_RATIO)
        .integerValue(BigNumber.ROUND_CEIL)
    );
    mintSirsParams = approveTzbtc.concat(
      lbDexContract.methodsObject
        .addLiquidity({
          owner: accountPkh,
          minLqtMinted: minimumReceivedAtomic,
          maxTokensDeposited: tzbtcAddLiqInput,
          deadline: Math.floor(Date.now() / 1000) + ONE_MINUTE
        })
        .toTransferParams({ amount: xtzAddLiqInput.toNumber(), mutez: true }),
      revokeTzbtc
    );
  }

  return burnSirsParams.concat(approvesParams, swapParams, mintSirsParams, revokesParams);
};

export const calculateOutputAmounts = (
  inputAmount: BigNumber.Value | undefined,
  inputAssetDecimals: number,
  route3OutputInTokens: string | undefined,
  outputAssetDecimals: number,
  slippageRatio: number
) => {
  const outputAtomicAmountBeforeFee = isDefined(route3OutputInTokens)
    ? tzToMutez(new BigNumber(route3OutputInTokens), outputAssetDecimals)
    : ZERO;
  const minOutputAtomicBeforeFee = multiplyAtomicAmount(
    outputAtomicAmountBeforeFee,
    slippageRatio,
    BigNumber.ROUND_FLOOR
  );
  const outputFeeAtomicAmount = calculateOutputFeeAtomic(
    tzToMutez(inputAmount ?? ZERO, inputAssetDecimals),
    minOutputAtomicBeforeFee
  );
  const expectedReceivedAtomic = outputAtomicAmountBeforeFee.minus(outputFeeAtomicAmount);
  const minimumReceivedAtomic = minOutputAtomicBeforeFee.minus(outputFeeAtomicAmount);

  return { outputAtomicAmountBeforeFee, expectedReceivedAtomic, minimumReceivedAtomic, outputFeeAtomicAmount };
};

export const multiplyAtomicAmount = (
  amount: BigNumber,
  multiplier: BigNumber.Value,
  roundMode?: BigNumber.RoundingMode
) => amount.times(multiplier).integerValue(roundMode);

export const calculateSlippageRatio = (slippageTolerancePercentage: number) =>
  (100 - slippageTolerancePercentage) / 100;
