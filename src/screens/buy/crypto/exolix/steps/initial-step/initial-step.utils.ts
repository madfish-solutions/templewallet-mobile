import { BigNumber } from 'bignumber.js';

import { ExchangePayload } from 'src/interfaces/exolix.interface';
import { loadExolixRate } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

// due to legal restrictions
const maxDollarValue = 10000;

const minAssetAmount = 0.00001;
const avgCommission = 300;

type setFieldType = (field: string, value: BigNumber | number) => void;

export const loadUSDTRate = async (coinTo: string, coinToNetwork: string) => {
  const exchangeData = {
    coinTo,
    coinToNetwork,
    coinFrom: 'USDT',
    coinFromNetwork: 'ETH',
    amount: 500
  };

  try {
    const { rate } = await loadExolixRate(exchangeData);

    return rate ?? 1;
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

    const forwardExchangeData = {
      coinTo: inputAssetCode,
      coinToNetwork: inputAssetNetwork,
      coinFrom: outputAssetCode,
      coinFromNetwork: outputAssetNetwork,
      amount: (maxDollarValue + avgCommission) / outputTokenPrice
    };

    const backwardExchangeData = {
      coinTo: outputAssetCode,
      coinToNetwork: outputAssetNetwork,
      coinFrom: inputAssetCode,
      coinFromNetwork: inputAssetNetwork,
      amount: minAssetAmount
    };

    const { minAmount } = await loadExolixRate(backwardExchangeData);

    // setting correct exchange amount
    backwardExchangeData.amount = minAmount ?? 0;

    // correct maxAmount returns only if exchange amount is correct
    const { maxAmount } = await loadExolixRate(backwardExchangeData);

    // getting maxAmount for our own maximum dollar exchange amount
    const { message, toAmount } = await loadExolixRate(forwardExchangeData);

    setFieldValue('coinFrom.min', new BigNumber(minAmount ?? 0));

    // if there is a message than something went wrong with the estimation and some values may be incorrect
    setFieldValue('coinFrom.max', new BigNumber((message === null ? toAmount : maxAmount) ?? 0));
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
    }
    if (isDefined(responseData.rate)) {
      setFieldValue('rate', responseData.rate);
    }
  });
};
