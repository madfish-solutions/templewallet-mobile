export const outputCoin = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png'
};

export const initialData = {
  coinFrom: {
    asset: {
      code: 'BTC',
      name: 'Bitcoin',
      icon: 'https://exolix.com/icons/coins/BTC.png'
    },
    amount: undefined,
    min: undefined,
    max: undefined
  },
  coinTo: {
    asset: outputCoin,
    amount: undefined
  }
};
