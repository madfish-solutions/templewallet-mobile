import { exolixTezosAsset } from '../../config';

export const initialCoinFrom = {
  code: 'BTC',
  name: 'Bitcoin',
  icon: 'https://exolix.com/icons/coins/BTC.png',
  network: {
    code: 'BTC',
    fullName: 'Bitcoin'
  }
};

export const initialCoinTo = exolixTezosAsset;

export const initialData = {
  coinFrom: {
    asset: initialCoinFrom,
    amount: undefined,
    min: 0,
    max: undefined
  },
  rate: 0,
  coinTo: {
    asset: initialCoinTo,
    amount: undefined
  }
};
