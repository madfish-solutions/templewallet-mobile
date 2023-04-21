import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';

import { outputTokensList } from '../../config';

export const initialData = {
  coinFrom: {
    asset: {
      code: 'BTC',
      name: 'Bitcoin',
      icon: 'https://exolix.com/icons/coins/BTC.png',
      network: 'BTC',
      networkFullName: 'Bitcoin',
      type: TopUpInputTypeEnum.Crypto
    },
    amount: undefined,
    min: 0,
    max: undefined
  },
  rate: 0,
  coinTo: {
    asset: outputTokensList[0],
    amount: undefined
  }
};
