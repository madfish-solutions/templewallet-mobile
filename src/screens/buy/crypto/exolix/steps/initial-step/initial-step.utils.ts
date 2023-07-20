import { BigNumber } from 'bignumber.js';

import { ExchangePayload } from 'src/interfaces/exolix.interface';
import { loadExolixRate } from 'src/utils/exolix.util';
import { isDefined } from 'src/utils/is-defined';

const maxDollarValue = 10000;
const avgCommission = 300;

type setFieldType = (field: string, value: BigNumber | number) => void;

// executed only once per changed pair to determine min, max
export const loadMinMaxFields = (
  setFieldValue: setFieldType,
  inputAssetCode = 'BTC',
  inputAssetNetwork = 'BTC',
  outputAssetCode = 'XTZ',
  outputAssetNetwork = 'XTZ',
  outputTokenPrice = 1
) => {
  const forwardExchangeData = {
    coinTo: inputAssetCode,
    coinToNetwork: inputAssetNetwork,
    coinFrom: outputAssetCode,
    coinFromNetwork: outputAssetNetwork,
    amount: (maxDollarValue + avgCommission) / outputTokenPrice
  };

  loadExolixRate(forwardExchangeData).then(
    responseData => {
      setFieldValue('coinFrom.max', new BigNumber(responseData.toAmount));
    },
    error => {
      console.error({ error });
    }
  );

  const backwardExchangeData = {
    coinFrom: inputAssetCode,
    coinFromNetwork: inputAssetNetwork,
    coinTo: outputAssetCode,
    coinToNetwork: outputAssetNetwork,
    amount: 1
  };

  loadExolixRate(backwardExchangeData).then(
    responseData => {
      setFieldValue('coinFrom.min', new BigNumber(responseData.minAmount));
    },
    error => {
      console.error({ error });
    }
  );
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
