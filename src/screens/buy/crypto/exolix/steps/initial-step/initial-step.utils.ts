import { BigNumber } from 'bignumber.js';

import { ExchangePayload } from 'src/types/exolix.types';
import { AnalyticsError } from 'src/utils/error-analytics-data.utils';
import { loadExolixRate } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

// due to legal restrictions
const MAX_DOLLAR_VALUE = 10000;

const MIN_ASSET_AMOUNT = 0.00001;
const AVG_COMISSION = 300;

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
  onAnalyticsError: SyncFn<AnalyticsError>,
  inputAssetCode = 'BTC',
  inputAssetNetwork = 'BTC',
  outputAssetCode = 'XTZ',
  outputAssetNetwork = 'XTZ'
) => {
  try {
    const exchangeData = {
      coinTo: outputAssetCode,
      coinToNetwork: outputAssetNetwork,
      coinFrom: inputAssetCode,
      coinFromNetwork: inputAssetNetwork,
      amount: MIN_ASSET_AMOUNT
    };

    let minAmountExchangeResponse = await loadExolixRate(exchangeData);

    if (!('minAmount' in minAmountExchangeResponse)) {
      throw new Error('Failed to get minimal input amount');
    }

    let minAmount = minAmountExchangeResponse.minAmount;
    // setting correct exchange amount
    exchangeData.amount = minAmount;

    if (!('maxAmount' in minAmountExchangeResponse)) {
      for (let i = 0; i < 2; i++) {
        // Getting maxAmount from the response for minimal exchange
        minAmountExchangeResponse = await loadExolixRate(exchangeData);

        if ('maxAmount' in minAmountExchangeResponse) {
          break;
        }

        // Preparing to try again with the new minimal amount
        minAmount = minAmountExchangeResponse.minAmount;
        exchangeData.amount = minAmount;
      }
    }

    if (!('maxAmount' in minAmountExchangeResponse)) {
      throw new Error('Failed to get maximal input amount');
    }

    // Trying to get an input amount for an output of 10K USD worth by getting reverse exchange
    const outputTokenPrice = await loadUSDTRate(outputAssetCode, outputAssetNetwork);
    const backwardExchange = await loadExolixRate({
      coinTo: inputAssetCode,
      coinToNetwork: inputAssetNetwork,
      coinFrom: outputAssetCode,
      coinFromNetwork: outputAssetNetwork,
      amount: (MAX_DOLLAR_VALUE + AVG_COMISSION) / outputTokenPrice
    });
    // Ignoring the invalid output of the backward exchange
    const maxDollarValueMaxAmount =
      backwardExchange.message == null && backwardExchange.toAmount >= minAmount
        ? backwardExchange.toAmount
        : undefined;

    // Choosing the least of maxAmount from the first exchange and the output of backward exchange, if any
    setFieldValue('coinFrom.min', new BigNumber(minAmount));

    // if there is a message than something went wrong with the estimation and some values may be incorrect
    setFieldValue(
      'coinFrom.max',
      BigNumber.min(minAmountExchangeResponse.maxAmount, maxDollarValueMaxAmount ?? Infinity)
    );
  } catch (error) {
    console.error({ error });

    if (error instanceof AnalyticsError) {
      onAnalyticsError(error);
    } else {
      onAnalyticsError(
        new AnalyticsError(error, [], { inputAssetCode, inputAssetNetwork, outputAssetCode, outputAssetNetwork })
      );
    }
  }
};

export const updateOutputInputValue = (
  requestData: Omit<ExchangePayload, 'withdrawalAddress' | 'withdrawalExtraId'>,
  setFieldValue: setFieldType
) =>
  loadExolixRate(requestData).then(responseData => {
    if (isDefined(responseData.toAmount) && responseData.toAmount > 0) {
      setFieldValue('coinTo.amount', new BigNumber(responseData.toAmount));
    } else {
      setFieldValue('coinTo.amount', new BigNumber(0));
    }

    if ('minAmount' in responseData) {
      setFieldValue('coinFrom.min', new BigNumber(responseData.minAmount));
    }
    if ('maxAmount' in responseData) {
      setFieldValue('coinFrom.max', new BigNumber(responseData.maxAmount));
    }

    if ('rate' in responseData) {
      setFieldValue('rate', responseData.rate);
    }
  });
