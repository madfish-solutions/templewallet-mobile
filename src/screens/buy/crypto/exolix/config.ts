import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';

export const EXOLIX_CONTACT_LINK = 'https://exolix.com/contact';

export const EXOLIX_TERMS_LINK = 'https://exolix.com/terms';
export const EXOLIX_PRIVICY_LINK = 'https://exolix.com/privacy';

const initialFromAsset: TopUpWithNetworkInterface = {
  code: 'BTC',
  name: 'Bitcoin',
  icon: 'https://exolix.com/icons/coins/BTC.png',
  network: {
    code: 'BTC',
    fullName: 'Bitcoin'
  }
};

const initialToAsset: TopUpWithNetworkInterface = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png',
  network: {
    code: 'XTZ',
    fullName: 'Tezos'
  }
};

export const initialFormValues = {
  coinFrom: {
    asset: initialFromAsset,
    amount: undefined,
    min: 0,
    max: undefined
  },
  rate: 0,
  coinTo: {
    asset: initialToAsset,
    amount: undefined
  }
};
