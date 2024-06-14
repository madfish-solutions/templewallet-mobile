import { BigNumber } from 'bignumber.js';

import { ExchangePayload } from 'src/types/exolix.types';
import { loadExolixRate } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

// due to legal restrictions
const maxDollarValue = 10000;

const minAssetAmount = 0.00001;
const avgCommission = 300;

type setFieldType = (field: string, value: BigNumber | number) => void;

const loadUSDTRate = async (coinTo: string, coinToNetwork: string) => {
  const exchangeData = {
    coinTo,
    coinToNetwork,
    coinFrom: 'USDT',
    coinFromNetwork: 'ETH',
    amount: 500
  };

  try {
    const result = await loadExolixRate(exchangeData);

    return 'rate' in result ? result.rate : 1;
  } catch (error) {
    console.error({ error });

    return 1;
  }
};

// executed only once per changed pair to determine min, max
export const loadMinMaxFields = async (
  setFieldValue: setFieldType,
  inputAssetCode = 'BTC',
  inputAssetNetwork = 'BTC',
  outputAssetCode = 'XTZ',
  outputAssetNetwork = 'XTZ'
) => {
  try {
    const outputTokenPrice = await loadUSDTRate(outputAssetCode, outputAssetNetwork);

    const backwardExchangeData = {
      coinTo: inputAssetCode,
      coinToNetwork: inputAssetNetwork,
      coinFrom: outputAssetCode,
      coinFromNetwork: outputAssetNetwork,
      amount: (maxDollarValue + avgCommission) / outputTokenPrice
    };

    const forwardExchangeData = {
      coinTo: outputAssetCode,
      coinToNetwork: outputAssetNetwork,
      coinFrom: inputAssetCode,
      coinFromNetwork: inputAssetNetwork,
      amount: minAssetAmount
    };

    const minAmountExchangeResponse = await loadExolixRate(forwardExchangeData);

    if (!('minAmount' in minAmountExchangeResponse)) {
      throw new Error('Failed to get minimal input amount');
    }

    let minAmount = minAmountExchangeResponse.minAmount;
    // setting correct exchange amount
    forwardExchangeData.amount = minAmount;

    let finalMaxAmount = 0;

    for (let i = 0; i < 10; i++) {
      const maxAmountExchangeResponse = await loadExolixRate(forwardExchangeData);

      if ('maxAmount' in maxAmountExchangeResponse) {
        finalMaxAmount = maxAmountExchangeResponse.maxAmount;
        break;
      }

      minAmount = maxAmountExchangeResponse.minAmount;
      forwardExchangeData.amount = minAmount;
    }

    if (finalMaxAmount === 0) {
      throw new Error('Failed to get maximal input amount');
    }

    const backwardExchange = await loadExolixRate(backwardExchangeData);

    setFieldValue(
      'coinFrom.min',
      BigNumber.min(minAmount, backwardExchange.message == null ? backwardExchange.toAmount : Infinity)
    );

    // if there is a message than something went wrong with the estimation and some values may be incorrect
    setFieldValue('coinFrom.max', new BigNumber(finalMaxAmount));
  } catch (error) {
    console.error({ error });
  }
};

export const updateOutputInputValue = (
  requestData: Omit<ExchangePayload, 'withdrawalAddress' | 'withdrawalExtraId'>,
  setFieldValue: setFieldType
) => {
  loadExolixRate(requestData).then(responseData => {
    if (isDefined(responseData.toAmount) && responseData.toAmount > 0) {
      setFieldValue('coinTo.amount', new BigNumber(responseData.toAmount));
    } else {
      setFieldValue('coinTo.amount', new BigNumber(0));
    }

    if ('rate' in responseData) {
      setFieldValue('rate', responseData.rate);
    }
  });
};
