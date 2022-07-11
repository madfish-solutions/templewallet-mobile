import { BigNumber } from 'bignumber.js';

import { RateInterface } from '../../../../interfaces/exolix.interface';
import { loadExolixRate } from '../../../../utils/exolix.util';
import { initialData } from './initial-step.data';

const maxDollarValue = 10000;
const avgCommission = 300;

export const loadMinMaxFields = (
  setFieldValue: (field: string, value: unknown) => void,
  inputAssetCode = 'BTC',
  tezPrice = 1
) => {
  const forwardExchangeData = {
    coinTo: inputAssetCode,
    coinFrom: initialData.coinTo.asset.code,
    amount: (maxDollarValue + avgCommission) / tezPrice
  };

  loadExolixRate(forwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.max', new BigNumber(responseData.toAmount));
  });

  const backwardExchangeData = {
    coinFrom: inputAssetCode,
    coinTo: initialData.coinTo.asset.code,
    amount: 0
  };

  loadExolixRate(backwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.min', new BigNumber(responseData.minAmount));
  });
};
