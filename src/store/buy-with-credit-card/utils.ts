import FiatCurrencyInfo from 'currency-codes';

import { PairsInfoResponse as AliceBobPairsInfoResponse } from 'src/apis/alice-bob/types';
import { MOONPAY_ASSETS_BASE_URL } from 'src/apis/moonpay/consts';
import {
  CurrencyType as MoonPayCurrencyType,
  CryptoCurrency,
  FiatCurrency as MoonPayFiatCurrency,
  Currency
} from 'src/apis/moonpay/types';
import { UTORG_CRYPTO_ICONS_BASE_URL, UTORG_FIAT_ICONS_BASE_URL } from 'src/apis/utorg/consts';
import { CurrencyInfoType as UtorgCurrencyType, UtorgCurrencyInfo } from 'src/apis/utorg/types';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';

interface AliceBobFiatCurrency {
  name: string;
  code: string;
  icon: string;
  precision: number;
}

const getCurrencyNameByCode = (code: string) => {
  const customCurrencyNames: Record<string, string> = {
    UAH: 'Ukrainian Hryvnia',
    KZT: 'Kazakhstani Tenge'
  };

  if (isDefined(customCurrencyNames[code])) {
    return customCurrencyNames[code];
  }

  const currencyInfo = FiatCurrencyInfo.code(code);

  return isDefined(currencyInfo) ? currencyInfo.currency : '???';
};

const knownAliceBobFiatCurrencies: Record<string, AliceBobFiatCurrency> = {
  UAH: {
    name: getCurrencyNameByCode('UAH'),
    code: 'UAH',
    icon: '',
    precision: 2
  },
  MYR: {
    name: getCurrencyNameByCode('MYR'),
    code: 'MYR',
    icon: `${UTORG_FIAT_ICONS_BASE_URL}MY.svg`,
    precision: 2
  },
  KZT: {
    name: getCurrencyNameByCode('KZT'),
    code: 'KZT',
    icon: '',
    precision: 2
  }
};

const aliceBobTezos = {
  name: 'Tezos',
  code: 'XTZ',
  icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/xtz.svg`,
  precision: 6,
  slug: 'tez'
};

export const mapMoonPayProviderCurrencies = (currencies: Currency[]) => ({
  fiat: currencies
    .filter((currency): currency is MoonPayFiatCurrency => currency.type === MoonPayCurrencyType.Fiat)
    .map(({ name, code, minBuyAmount, maxBuyAmount, precision }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/${code}.svg`,
      minAmount: minBuyAmount,
      maxAmount: maxBuyAmount,
      precision: Math.min(precision, 2) // Currencies like JOD have 3 decimals but Moonpay fails to process input with 3 decimals
    })),
  crypto: currencies
    .filter(
      (currency): currency is CryptoCurrency =>
        currency.type === MoonPayCurrencyType.Crypto && currency.metadata.networkCode.toLowerCase() === 'tezos'
    )
    .map(({ name, code, precision, minBuyAmount, maxBuyAmount, metadata }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      icon: `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/${code}.svg`,
      minAmount: minBuyAmount ?? undefined,
      maxAmount: maxBuyAmount ?? undefined,
      precision,
      slug: isDefined(metadata.contractAddress)
        ? toTokenSlug(metadata.contractAddress, metadata.coinType ?? undefined)
        : ''
    }))
});

export const mapUtorgProviderCurrencies = (currencies: UtorgCurrencyInfo[]) => ({
  fiat: currencies
    .filter(({ type, depositMax }) => type === UtorgCurrencyType.FIAT && depositMax > 0)
    .map(({ display, symbol: code, depositMin, depositMax, precision }) => ({
      name: getCurrencyNameByCode(code),
      code,
      codeToDisplay: display,
      icon: `${UTORG_FIAT_ICONS_BASE_URL}${code.slice(0, -1)}.svg`,
      precision,
      minAmount: depositMin,
      maxAmount: depositMax
    })),
  crypto: currencies
    .filter(({ chain, type, depositMax }) => type === UtorgCurrencyType.CRYPTO && depositMax > 0 && chain === 'TEZOS')
    .map(({ currency, display, precision }) => ({
      name: display,
      code: currency,
      codeToDisplay: display,
      icon: `${UTORG_CRYPTO_ICONS_BASE_URL}/${currency}.svg`,
      precision,
      slug: '' // TODO: implement making correct slug as soon as any Tezos token is supported by Utorg
    }))
});

export const mapAliceBobProviderCurrencies = ({ pairsInfo }: AliceBobPairsInfoResponse) => ({
  fiat: pairsInfo.map(pair => {
    const [minAmountString, code] = pair.minamount.split(' ');
    const minAmount = Number(minAmountString);
    const maxAmount = Number(pair.maxamount.split(' ')[0]);

    if (isDefined(knownAliceBobFiatCurrencies[code])) {
      return {
        ...knownAliceBobFiatCurrencies[code],
        minAmount,
        maxAmount
      };
    }

    return {
      name: getCurrencyNameByCode(code),
      code,
      icon: `https://static.moonpay.com/widget/currencies/${code.toLowerCase()}.svg`,
      precision: 2,
      minAmount,
      maxAmount
    };
  }),
  crypto: [aliceBobTezos]
});
