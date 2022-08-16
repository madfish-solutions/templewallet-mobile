export const outputCoin = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png',
  network: 'XTZ',
  networkFullName: 'Tezos'
};

export const initialData = {
  coinFrom: {
    asset: {
      code: 'BTC',
      name: 'Bitcoin',
      icon: 'https://exolix.com/icons/coins/BTC.png',
      network: 'BTC',
      networkFullName: 'Bitcoin'
    },
    amount: undefined,
    min: 0,
    max: undefined
  },
  rate: 0,
  coinTo: {
    asset: outputCoin,
    amount: undefined
  }
};
