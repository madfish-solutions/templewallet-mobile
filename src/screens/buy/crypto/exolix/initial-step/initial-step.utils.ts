import { BigNumber } from 'bignumber.js';

import { CurrenciesInterface, ExchangePayload, RateInterface } from '../../../../../interfaces/exolix.interface';
import { loadExolixRate } from '../../../../../utils/exolix.util';
import { isDefined } from '../../../../../utils/is-defined';

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

  loadExolixRate(forwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.max', new BigNumber(responseData.toAmount));
  });

  const backwardExchangeData = {
    coinFrom: inputAssetCode,
    coinFromNetwork: inputAssetNetwork,
    coinTo: outputAssetCode,
    coinToNetwork: outputAssetNetwork,
    amount: 1
  };

  loadExolixRate(backwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.min', new BigNumber(responseData.minAmount));
  });
};

export const getProperNetworkFullName = (currency: CurrenciesInterface) =>
  currency.name === currency.networkFullName ? currency.networkFullName + ' Mainnet' : currency.networkFullName;

export const updateOutputInputValue = (
  requestData: Omit<ExchangePayload, 'withdrawalAddress' | 'withdrawalExtraId'>,
  setFieldValue: setFieldType
) => {
  loadExolixRate(requestData).then((responseData: RateInterface) => {
    if (isDefined(responseData.toAmount) && responseData.toAmount > 0) {
      setFieldValue('coinTo.amount', new BigNumber(responseData.toAmount));
    }
    if (isDefined(responseData.rate)) {
      setFieldValue('rate', responseData.rate);
    }
  });
};
