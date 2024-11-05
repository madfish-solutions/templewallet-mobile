import { ContractMethod, ContractProvider, OpKind, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom, map } from 'rxjs';

import {
  APP_ID,
  ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT,
  CASHBACK_RATIO,
  LIQUIDITY_BAKING_PROXY_CONTRACT,
  ROUTE3_CONTRACT,
  ROUTING_FEE_RATIO
} from 'src/config/swap';
import { isSwapHops, Route3LiquidityBakingHops, Route3SwapHops, Route3Token } from 'src/interfaces/route3.interface';

import { ZERO } from './number.util';
import { mapToRoute3ExecuteHops } from './route3.util';
import { getReadOnlyContract } from './rpc/contract.utils';
import { MINIMAL_FEE_PER_GAS_MUTEZ } from './tezos.util';
import { getTransferParams$ } from './transfer-params.utils';
import { getTransferPermissions } from './transfer-permissions.util';

const GAS_CAP = 1000;

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
  minimumReceivedAtomic: BigNumber,
  hops: Route3LiquidityBakingHops | Route3SwapHops,
  tezos: TezosToolkit,
  accountPkh: string
) => {
  const resultParams: Array<TransferParams> = [];
  let swapMethod: ContractMethod<ContractProvider>;

  if (isSwapHops(hops)) {
    const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
    swapMethod = swapContract.methods.execute(
      fromRoute3Token.id,
      toRoute3Token.id,
      minimumReceivedAtomic,
      accountPkh,
      mapToRoute3ExecuteHops(hops.hops),
      APP_ID
    );
  } else {
    const liquidityBakingProxyContract = await getReadOnlyContract(LIQUIDITY_BAKING_PROXY_CONTRACT, tezos);
    swapMethod = liquidityBakingProxyContract.methods.swap(
      fromRoute3Token.id,
      toRoute3Token.id,
      mapToRoute3ExecuteHops(hops.xtzHops),
      mapToRoute3ExecuteHops(hops.tzbtcHops),
      inputAmountAtomic,
      minimumReceivedAtomic,
      accountPkh,
      APP_ID
    );
  }

  if (fromRoute3Token.symbol.toLowerCase() === 'xtz') {
    resultParams.push(
      swapMethod.toTransferParams({
        amount: inputAmountAtomic.toNumber(),
        mutez: true
      })
    );
  } else {
    resultParams.push(swapMethod.toTransferParams());
  }

  const { approve, revoke } = await getTransferPermissions(
    tezos,
    isSwapHops(hops) ? ROUTE3_CONTRACT : LIQUIDITY_BAKING_PROXY_CONTRACT,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic
  );

  resultParams.unshift(...approve);
  try {
    const estimations = await tezos.estimate.batch(
      resultParams.map(params => ({ kind: OpKind.TRANSACTION, ...params }))
    );
    estimations.forEach(({ suggestedFeeMutez, storageLimit, gasLimit }, index) => {
      const currentParams = resultParams[index];
      currentParams.fee = suggestedFeeMutez + GAS_CAP * MINIMAL_FEE_PER_GAS_MUTEZ;
      currentParams.storageLimit = storageLimit;
      currentParams.gasLimit = gasLimit + GAS_CAP;
    });
  } catch (e) {
    console.error(e);
  }
  resultParams.push(...revoke);

  return resultParams;
};

export const calculateSlippageRatio = (slippageTolerancePercentage: number) =>
  (100 - slippageTolerancePercentage) / 100;
