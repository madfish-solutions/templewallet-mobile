import { BigNumber } from 'bignumber.js';
import { binanceCryptoIcons } from 'binance-icons';
import CurrenciesCodes from 'currency-codes';

import { PairInfoResponse as AliceBobPairInfoResponse } from 'src/apis/alice-bob/types';
import { MOONPAY_ASSETS_BASE_URL } from 'src/apis/moonpay/consts';
import {
  CurrencyType as MoonPayCurrencyType,
  CryptoCurrency,
  FiatCurrency as MoonPayFiatCurrency,
  Currency
} from 'src/apis/moonpay/types';
import { GetBinanceConnectCurrenciesResponse } from 'src/apis/temple-static';
import { UTORG_CRYPTO_ICONS_BASE_URL, UTORG_FIAT_ICONS_BASE_URL } from 'src/apis/utorg/consts';
import { CurrencyInfoType as UtorgCurrencyType, UtorgCurrencyInfo } from 'src/apis/utorg/types';
import { KNOWN_MAINNET_TOKENS_METADATA } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { filterByStringProperty } from 'src/utils/array.utils';
import { SVG_DATA_URI_UTF8_PREFIX } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';

import { TopUpProviderCurrencies } from './state';

const knownUtorgFiatCurrenciesNames: Record<string, string> = {
  PHP: 'Philippine Peso',
  INR: 'Indian Rupee'
};

const aliceBobHryvnia = {
  name: 'Ukrainian Hryvnia',
  code: 'UAH',
  icon: '',
  precision: 2
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
    .map(({ display, symbol, depositMin, depositMax, precision }) => ({
      name: knownUtorgFiatCurrenciesNames[symbol] ?? '',
      code: symbol,
      codeToDisplay: display,
      icon: `${UTORG_FIAT_ICONS_BASE_URL}${symbol.slice(0, -1)}.svg`,
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

export const mapBinanceConnectProviderCurrencies = (
  data: GetBinanceConnectCurrenciesResponse
): TopUpProviderCurrencies => {
  const fiat = filterByStringProperty(data.pairs, 'fiatCurrency').map(item => {
    const code = item.fiatCurrency;

    return {
      name: CurrenciesCodes.code(code)?.currency ?? code,
      code,
      icon: `${UTORG_FIAT_ICONS_BASE_URL}${code.slice(0, -1)}.svg`,
      /** Assumed */
      precision: 2,
      minAmount: item.minLimit,
      maxAmount: item.maxLimit
    };
  });

  const crypto = data.assets.map(asset => {
    const { contractAddress, cryptoCurrency: code, withdrawIntegerMultiple } = asset;

    const precision =
      withdrawIntegerMultiple && Number.isFinite(withdrawIntegerMultiple)
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new BigNumber(withdrawIntegerMultiple).decimalPlaces()!
        : 0;

    const iconSvgString = binanceCryptoIcons.get(code.toLowerCase());
    const icon = isString(iconSvgString) ? `${SVG_DATA_URI_UTF8_PREFIX}${encodeURIComponent(iconSvgString)}` : '';

    return {
      /** No token id available */
      slug: isString(contractAddress) ? toTokenSlug(contractAddress) : '',
      name: getBinanceConnectCryptoCurrencyName(code, contractAddress),
      code,
      icon,
      precision,
      minAmount: asset.withdrawMin,
      maxAmount: asset.withdrawMax
    };
  });

  return { fiat, crypto };
};

const getBinanceConnectCryptoCurrencyName = (code: string, address: string | null) => {
  if (!isTruthy(address) || code === 'XTZ') {
    return 'Tezos';
  }

  return KNOWN_MAINNET_TOKENS_METADATA.find(m => m.address === address && m.id === 0)?.name ?? code;
};
