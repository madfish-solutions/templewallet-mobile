import { outputTokensList } from '../../config';

export const initialData = {
  coinFrom: {
    asset: {
      code: 'BTC',
      name: 'Bitcoin',
      icon: 'https://exolix.com/icons/coins/BTC.png',
      network: {
        code: 'BTC',
        fullName: 'Bitcoin'
      }
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
