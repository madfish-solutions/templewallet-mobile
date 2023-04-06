import { PairInfoResponse as AliceBobPairInfoResponse } from 'src/apis/alice-bob/types';
import { CryptoCurrency, FiatCurrency } from 'src/apis/moonpay/apollo/types';
import { UTORG_CRYPTO_ICONS_BASE_URL, UTORG_FIAT_ICONS_BASE_URL } from 'src/apis/utorg/consts';
import { CurrencyInfoType, UtorgCurrencyInfo } from 'src/apis/utorg/types';
import { TopUpInputTypeEnum } from 'src/enums/top-up-input-type.enum';

const knownUtorgFiatCurrenciesNames: Record<string, string> = {
  PHP: 'Philippine Peso',
  INR: 'Indian Rupee'
};

const aliceBobHryvnia = {
  name: 'Ukrainian Hryvnia',
  code: 'UAH',
  network: '',
  networkFullName: '',
  icon: '',
  precision: 2,
  type: TopUpInputTypeEnum.Fiat
};

const aliceBobTezos = {
  name: 'Tezos',
  code: 'XTZ',
  network: 'tezos',
  networkFullName: 'Tezos',
  icon: 'https://static.moonpay.com/widget/currencies/xtz.svg',
  precision: 6,
  slug: 'tez',
  type: TopUpInputTypeEnum.Crypto
};

export const mapMoonPayProviderCurrencies = ([fiatCurrencies, cryptoCurrencies]: [
  FiatCurrency[],
  CryptoCurrency[]
]) => ({
  fiat: fiatCurrencies.map(({ name, code, icon, minBuyAmount, maxBuyAmount, precision }) => ({
    name,
    code: code.toUpperCase(),
    network: '',
    networkFullName: '',
    icon,
    minAmount: minBuyAmount,
    maxAmount: maxBuyAmount,
    precision: Math.min(precision, 2), // Currencies like JOD have 3 decimals but Moonpay fails to process input with 3 decimals
    type: TopUpInputTypeEnum.Fiat
  })),
  crypto: cryptoCurrencies
    .filter(({ networkCode }) => networkCode.toLowerCase() === 'tezos')
    .map(({ name, code, icon, precision }) => ({
      name,
      code: code.toUpperCase(),
      network: 'tezos',
      networkFullName: 'Tezos',
      icon,
      precision,
      type: TopUpInputTypeEnum.Crypto,
      slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Moonpay
    }))
});

export const mapUtorgProviderCurrencies = (currencies: UtorgCurrencyInfo[]) => ({
  fiat: currencies
    .filter(({ type, depositMax }) => type === CurrencyInfoType.FIAT && depositMax > 0)
    .map(({ symbol, depositMin, depositMax, precision }) => ({
      name: knownUtorgFiatCurrenciesNames[symbol] ?? '',
      code: symbol,
      network: '',
      networkFullName: '',
      icon: `${UTORG_FIAT_ICONS_BASE_URL}${symbol.slice(0, -1)}.svg`,
      precision,
      type: TopUpInputTypeEnum.Fiat,
      minAmount: depositMin,
      maxAmount: depositMax
    })),
  crypto: currencies
    .filter(({ chain, type, depositMax }) => type === CurrencyInfoType.CRYPTO && depositMax > 0 && chain === 'TEZOS')
    .map(({ currency, symbol, precision }) => ({
      name: symbol,
      code: symbol,
      network: 'tezos',
      networkFullName: 'Tezos',
      icon: `${UTORG_CRYPTO_ICONS_BASE_URL}/${currency}.svg`,
      precision,
      type: TopUpInputTypeEnum.Crypto,
      slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Utorg
    }))
});

export const mapAliceBobProviderCurrencies = ({ minAmount, maxAmount }: AliceBobPairInfoResponse) => ({
  fiat: [
    {
      ...aliceBobHryvnia,
      minAmount: minAmount,
      maxAmount: maxAmount
    }
  ],
  crypto: [aliceBobTezos]
});
