import { BigNumber } from 'bignumber.js';

import { RateInterface } from '../../../../interfaces/exolix.interface';
import { loadExolixRate } from '../../../../utils/exolix.util';
import { initialData } from './initial-step.data';

const maxDollarValue = 10000;
const avgCommission = 300;

type setFieldType = (field: 'coinFrom.max' | 'coinFrom.min', value: BigNumber | number) => void;

// executed only once per changed pair to determine min, max
export const loadMinMaxFields = (setFieldValue: setFieldType, inputAssetCode = 'BTC', tezPrice = 1) => {
  // TEZ to coin
  const forwardExchangeData = {
    coinTo: inputAssetCode,
    coinFrom: initialData.coinTo.asset.code,
    amount: (maxDollarValue + avgCommission) / tezPrice
  };

  loadExolixRate(forwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.max', new BigNumber(responseData.toAmount));
  });

  // coin to TEZ, similar to regular submit
  const backwardExchangeData = {
    coinFrom: inputAssetCode,
    coinTo: initialData.coinTo.asset.code,
    amount: 1
  };

  loadExolixRate(backwardExchangeData).then((responseData: RateInterface) => {
    setFieldValue('coinFrom.min', new BigNumber(responseData.minAmount));
  });
};
