import { FoundDex } from '@quipuswap/sdk';
import { ContractAbstraction, ContractProvider } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { AssetAmountInterface } from '../components/asset-amount-input/asset-amount-input';

export const QS_FACTORIES = {
  fa1_2Factory: ['KT1FWHLMk5tHbwuSsp31S4Jum4dTVmkXpfJw', 'KT1Lw8hCoaBrHeTeMXbqHPG4sS4K1xn7yKcD'],
  fa2Factory: ['KT1PvEyN1xCFCgorN92QCfYjw3axS6jawCiJ', 'KT1SwH9P1Tx8a58Mm6qBExQFTcy2rwZyZiXS']
};

export const LIQUIDITY_BAKING_CONTRACT = 'KT1TxqZ8QtKvLu3V3JH7Gx58n7Co8pgtpQU5';

export const SLIPPAGE_TOLERANCE_PRESETS = ['0.5', '1', '3'];
export const FEE = 997;
export const L_B_FEE = 999;

export const deadline = () => Math.floor(Date.now() / 1000) + 30 * 60 * 1000;

export enum ExchangeTypeEnum {
  TEZ_TO_TOKEN = 'TEZ_TO_TOKEN',
  TOKEN_TO_TEZ = 'TOKEN_TO_TEZ',
  TOKEN_TO_TOKEN = 'TOKEN_TO_TOKEN'
}

export const numbersAndDotRegExp = /^[0-9]*\.?[0-9]*$/;

export const estimateAssetToAsset = (
  dexStorage: FoundDex['storage'],
  value: BigNumber,
  exchangeType: ExchangeTypeEnum
) => {
  const valueBN = new BigNumber(value);
  if (valueBN.isZero()) {
    return new BigNumber(0);
  }
  const tezInWithFee = new BigNumber(valueBN).times(FEE);
  const numerator = tezInWithFee.times(
    exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN ? dexStorage.storage.token_pool : dexStorage.storage.tez_pool
  );
  const denominator = new BigNumber(
    exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN ? dexStorage.storage.tez_pool : dexStorage.storage.token_pool
  )
    .times(1000)
    .plus(tezInWithFee);

  return numerator.idiv(denominator);
};

export const estimateAssetToAssetInverse = (
  dexStorage: FoundDex['storage'],
  value: BigNumber,
  exchangeType: ExchangeTypeEnum
) => {
  const tokenValueBN = new BigNumber(value);
  if (tokenValueBN.isZero()) {
    return new BigNumber(0);
  }

  const numerator = new BigNumber(
    exchangeType === ExchangeTypeEnum.TOKEN_TO_TEZ ? dexStorage.storage.tez_pool : dexStorage.storage.token_pool
  )
    .times(1000)
    .times(tokenValueBN);
  const denominator = new BigNumber(
    exchangeType === ExchangeTypeEnum.TOKEN_TO_TEZ ? dexStorage.storage.token_pool : dexStorage.storage.tez_pool
  )
    .minus(tokenValueBN)
    .times(FEE);

  return numerator.idiv(denominator);
};

export const getAssetInput = (
  tokenAmount: BigNumber,
  exchangeType: ExchangeTypeEnum,
  inputDexState: ContractAbstraction<ContractProvider>
): BigNumber => {
  if (tokenAmount.eq(0)) {
    return new BigNumber(0);
  }
  const { tokenPool, xtzPool } = inputDexState as unknown as { tokenPool: BigNumber; xtzPool: BigNumber };
  const numerator =
    exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN
      ? tokenPool.times(1000).times(tokenAmount)
      : xtzPool.times(1000).times(tokenAmount);
  const denominator =
    exchangeType === ExchangeTypeEnum.TEZ_TO_TOKEN
      ? xtzPool.minus(tokenAmount).times(L_B_FEE)
      : tokenPool.minus(tokenAmount).times(L_B_FEE);

  return numerator.idiv(denominator).plus(1);
};

export const getAssetOutput = (
  tokenAmount: BigNumber,
  exchangeType: ExchangeTypeEnum,
  inputDexState: ContractAbstraction<ContractProvider>
) => {
  const { tokenPool, xtzPool } = inputDexState as unknown as { tokenPool: BigNumber; xtzPool: BigNumber };
  const invariant = tokenPool.multipliedBy(xtzPool);
  if (invariant.eq(0)) {
    return new BigNumber(0);
  }

  const tezInWithFee = tokenAmount.multipliedBy(L_B_FEE);

  return exchangeType !== ExchangeTypeEnum.TEZ_TO_TOKEN
    ? tezInWithFee.times(xtzPool).idiv(tokenPool.times(1000).plus(tezInWithFee))
    : tezInWithFee.times(tokenPool).idiv(xtzPool.times(1000).plus(tezInWithFee));
};

export const minimumReceived = (
  swapFromField: AssetAmountInterface,
  swapToField: AssetAmountInterface,
  slippageTolerance: string
) => {
  if ([swapFromField.amount, swapToField.amount, swapToField.asset].includes(undefined)) {
    return undefined;
  }
  const tokensParts = new BigNumber(10).pow(swapToField.asset.decimals);

  const outputAssetAmount = swapToField.amount ?? new BigNumber(0);

  return new BigNumber(outputAssetAmount)
    .multipliedBy(tokensParts)
    .multipliedBy(100 - Number(slippageTolerance))
    .idiv(100)
    .dividedBy(tokensParts)
    .toFixed();
};
