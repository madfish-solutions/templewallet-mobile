import { ExolixTopUpInputInterface, ExolixTopUpOutputInterface } from './exolix-topup.form';

export const EXOLIX_CONTACT_LINK =
  'https://docs.google.com/forms/d/e/1FAIpQLSdec4jK16R8uQ-05MRk7QgNi7y3PE5l7ojI5dvMYlfrX2LKDQ/viewform';

export const EXOLIX_TERMS_LINK = 'https://exolix.com/terms';
export const EXOLIX_PRIVICY_LINK = 'https://exolix.com/privacy';

const initialFromAsset: ExolixTopUpInputInterface = {
  code: 'BTC',
  name: 'Bitcoin',
  icon: 'https://exolix.com/icons/coins/BTC.png',
  network: {
    code: 'BTC',
    fullName: 'Bitcoin'
  }
};

const initialToAsset: ExolixTopUpOutputInterface = {
  code: 'XTZ',
  name: 'Tezos',
  icon: 'https://exolix.com/icons/coins/XTZ.png',
  network: {
    code: 'XTZ',
    fullName: 'Tezos'
  },
  slug: 'tez'
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

export const outputTokensList: ExolixTopUpOutputInterface[] = [
  initialToAsset,
  {
    code: 'USDT',
    icon: 'https://exolix.com/icons/coins/USDT.png',
    name: 'TetherUS',
    network: {
      code: 'XTZ',
      fullName: 'Tezos Mainnet',
      shortName: 'Tezos'
    },
    slug: 'KT1XnTn74bUtxHfDtBmm2bGZAQfhPbvKWR8o_0'
  }
];
