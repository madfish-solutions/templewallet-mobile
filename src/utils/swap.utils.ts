import { ContractMethod, ContractProvider, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom, map } from 'rxjs';

import {
  APP_ID,
  ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT,
  LIQUIDITY_BAKING_PROXY_CONTRACT,
  ROUTE3_CONTRACT,
  ROUTING_FEE_RATIO
} from 'src/config/swap';
import {
  isSwapChains,
  Route3LiquidityBakingChains,
  Route3SwapChains,
  Route3Token
} from 'src/interfaces/route3.interface';
import { THREE_ROUTE_SIRS_TOKEN } from 'src/token/data/three-route-tokens';
import { TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';

import { ZERO } from './number.util';
import { mapToRoute3ExecuteHops } from './route3.util';
import { getReadOnlyContract } from './rpc/contract.utils';
import { getTransferParams$ } from './transfer-params.utils';
import { getTransferPermissions } from './transfer-permissions.util';

export const calculateRoutingInputAndFeeFromInput = (inputAmount: BigNumber | undefined) => {
  const swapInputAtomic = (inputAmount ?? ZERO).integerValue(BigNumber.ROUND_DOWN);
  const shouldTakeFeeFromInput = swapInputAtomic.gte(ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT);
  const swapInputMinusFeeAtomic = shouldTakeFeeFromInput
    ? swapInputAtomic.times(ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_DOWN)
    : swapInputAtomic;
  const routingFeeFromInputAtomic = swapInputAtomic.minus(swapInputMinusFeeAtomic);

  return {
    swapInputMinusFeeAtomic,
    routingFeeFromInputAtomic
  };
};

export const calculateFeeFromOutput = (inputAmount: BigNumber | undefined, outputAmount: BigNumber) =>
  (inputAmount ?? ZERO).gte(ATOMIC_INPUT_THRESHOLD_FOR_FEE_FROM_INPUT)
    ? ZERO
    : outputAmount.times(1 - ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_UP);

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
  chains: Route3SwapChains | Route3LiquidityBakingChains,
  tezos: TezosToolkit,
  accountPkh: string
) => {
  const resultParams: Array<TransferParams> = [];
  let swapMethod: ContractMethod<ContractProvider>;

  if (isSwapChains(chains)) {
    const swapContract = await getReadOnlyContract(ROUTE3_CONTRACT, tezos);
    swapMethod = swapContract.methods.execute(
      fromRoute3Token.id,
      toRoute3Token.id,
      minimumReceivedAtomic,
      accountPkh,
      mapToRoute3ExecuteHops(chains.chains, fromRoute3Token.decimals),
      APP_ID
    );
  } else {
    const liquidityBakingProxyContract = await getReadOnlyContract(LIQUIDITY_BAKING_PROXY_CONTRACT, tezos);
    const isDivestingFromLb = fromRoute3Token.symbol === THREE_ROUTE_SIRS_TOKEN.symbol;
    swapMethod = liquidityBakingProxyContract.methods.swap(
      fromRoute3Token.id,
      toRoute3Token.id,
      mapToRoute3ExecuteHops(
        chains.xtzChain.chains,
        isDivestingFromLb ? TEZ_TOKEN_METADATA.decimals : fromRoute3Token.decimals
      ),
      mapToRoute3ExecuteHops(
        chains.tzbtcChain.chains,
        isDivestingFromLb ? TZBTC_TOKEN_METADATA.decimals : fromRoute3Token.decimals
      ),
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
    isSwapChains(chains) ? ROUTE3_CONTRACT : LIQUIDITY_BAKING_PROXY_CONTRACT,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic
  );

  resultParams.unshift(...approve);
  resultParams.push(...revoke);

  return resultParams;
};

export const calculateSlippageRatio = (slippageTolerancePercentage: number) =>
  (100 - slippageTolerancePercentage) / 100;
