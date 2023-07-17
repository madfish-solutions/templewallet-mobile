import { ContractAbstraction, ContractProvider, TezosToolkit, TransferParams } from '@taquito/taquito';
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
import { Route3Chain, Route3Token } from 'src/interfaces/route3.interface';
import { TEZ_TOKEN_METADATA, TZBTC_TOKEN_METADATA } from 'src/token/data/tokens-metadata';

import { mapToRoute3ExecuteHops } from './route3.util';
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

const withTransferPermissions = async (
  transferParams: TransferParams[],
  tezos: TezosToolkit,
  accountPkh: string,
  fromRoute3Token: Route3Token,
  inputAmountAtomic: BigNumber,
  spender: string
) => {
  const { approve, revoke } = await getTransferPermissions(
    tezos,
    spender,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic
  );

  return [...approve, ...transferParams, ...revoke];
};

export const getSwapTransferParams = async (
  fromRoute3Token: Route3Token,
  toRoute3Token: Route3Token,
  inputAmountAtomic: BigNumber,
  minimumReceivedAtomic: BigNumber,
  chains: Array<Route3Chain>,
  tezos: TezosToolkit,
  accountPkh: string,
  swapContract: ContractAbstraction<ContractProvider>
) => {
  const swapMethod = swapContract.methods.execute(
    fromRoute3Token.id,
    toRoute3Token.id,
    minimumReceivedAtomic,
    accountPkh,
    mapToRoute3ExecuteHops(chains, fromRoute3Token.decimals),
    APP_ID
  );

  const swapOpParams = swapMethod.toTransferParams({
    amount: fromRoute3Token.symbol.toLowerCase() === 'xtz' ? inputAmountAtomic.toNumber() : 0,
    mutez: true
  });

  return await withTransferPermissions(
    [swapOpParams],
    tezos,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic,
    ROUTE3_CONTRACT
  );
};

export const getLiquidityBakingTransferParams = async (
  fromRoute3Token: Route3Token,
  toRoute3Token: Route3Token,
  inputAmountAtomic: BigNumber,
  minimumReceivedAtomic: BigNumber,
  tzbtcChains: Array<Route3Chain>,
  xtzChains: Array<Route3Chain>,
  tezos: TezosToolkit,
  accountPkh: string,
  liquidityBakingProxyContract: ContractAbstraction<ContractProvider>
) => {
  const isDivestingFromLb = fromRoute3Token.symbol.toLowerCase() === THREE_ROUTE_SIRS_SYMBOL.toLowerCase();
  const swapMethod = liquidityBakingProxyContract.methods.swap(
    fromRoute3Token.id,
    toRoute3Token.id,
    mapToRoute3ExecuteHops(xtzChains, isDivestingFromLb ? TEZ_TOKEN_METADATA.decimals : fromRoute3Token.decimals),
    mapToRoute3ExecuteHops(tzbtcChains, isDivestingFromLb ? TZBTC_TOKEN_METADATA.decimals : fromRoute3Token.decimals),
    inputAmountAtomic,
    minimumReceivedAtomic,
    accountPkh,
    APP_ID
  );

  const swapOpParams = swapMethod.toTransferParams({
    amount: fromRoute3Token.symbol.toLowerCase() === 'xtz' ? inputAmountAtomic.toNumber() : 0,
    mutez: true
  });

  return await withTransferPermissions(
    [swapOpParams],
    tezos,
    accountPkh,
    fromRoute3Token,
    inputAmountAtomic,
    LIQUIDITY_BAKING_PROXY_CONTRACT
  );
};

export const calculateSlippageRatio = (slippageTolerancePercentage: number) =>
  (100 - slippageTolerancePercentage) / 100;
