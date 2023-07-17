import { ContractMethod, ContractProvider, TezosToolkit, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { firstValueFrom } from 'rxjs';

import {
  APP_ID,
  LIQUIDITY_BAKING_PROXY_CONTRACT,
  ROUTE3_CONTRACT,
  ROUTING_FEE_RATIO,
  THREE_ROUTE_SIRS_SYMBOL,
  ZERO
} from 'src/config/swap';
import {
  isSwapChains,
  Route3LiquidityBakingChains,
  Route3SwapChains,
  Route3Token
} from 'src/interfaces/route3.interface';
import { TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';

import { mapToRoute3ExecuteHops } from './route3.util';
import { getReadOnlyContract } from './rpc/contract.utils';
import { getTransferParams$ } from './transfer-params.utils';
import { getTransferPermissions } from './transfer-permissions.util';

export const calculateRoutingInputAndFee = (inputAmount: BigNumber | undefined) => {
  const swapInputAtomic = (inputAmount ?? ZERO).integerValue(BigNumber.ROUND_DOWN);
  const swapInputMinusFeeAtomic = swapInputAtomic.times(ROUTING_FEE_RATIO).integerValue(BigNumber.ROUND_DOWN);
  const routingFeeAtomic = swapInputAtomic.minus(swapInputMinusFeeAtomic);

  return {
    swapInputMinusFeeAtomic,
    routingFeeAtomic
  };
};

export const getRoutingFeeTransferParams = async (
  token: Route3Token,
  feeAmountAtomic: BigNumber,
  senderPublicKeyHash: string,
  routingFeeAddress: string,
  tezos: TezosToolkit
) =>
  firstValueFrom(
    getTransferParams$(
      { address: token.contract ?? '', id: Number(token.tokenId ?? 0) },
      tezos,
      senderPublicKeyHash,
      routingFeeAddress,
      feeAmountAtomic
    )
  );

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
    const isDivestingFromLb = fromRoute3Token.symbol === THREE_ROUTE_SIRS_SYMBOL;
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
