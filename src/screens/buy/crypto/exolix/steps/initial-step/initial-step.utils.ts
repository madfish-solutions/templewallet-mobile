import { BigNumber } from 'bignumber.js';

import { ExchangePayload } from 'src/types/exolix.types';
import { loadExolixRate } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

const minAssetAmount = 0.00001;

type setFieldType = (field: string, value: BigNumber | number) => void;

// executed only once per changed pair to determine min, max
export const loadMinMaxFields = async (
  setFieldValue: setFieldType,
  inputAssetCode = 'BTC',
  inputAssetNetwork = 'BTC',
  outputAssetCode = 'XTZ',
  outputAssetNetwork = 'XTZ'
) => {
  try {
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

    let finalMinAmount = minAmountExchangeResponse.minAmount;
    // setting correct exchange amount
    forwardExchangeData.amount = finalMinAmount;

    let finalMaxAmount = 0;

    for (let i = 0; i < 10; i++) {
      const maxAmountExchangeResponse = await loadExolixRate(forwardExchangeData);

      if ('maxAmount' in maxAmountExchangeResponse) {
        finalMaxAmount = maxAmountExchangeResponse.maxAmount;
        break;
      }

      finalMinAmount = maxAmountExchangeResponse.minAmount;
      forwardExchangeData.amount = finalMinAmount;
    }

    if (finalMaxAmount === 0) {
      throw new Error('Failed to get maximal input amount');
    }

    setFieldValue('coinFrom.min', new BigNumber(finalMinAmount));

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
