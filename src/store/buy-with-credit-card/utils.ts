import FiatCurrencyInfo from 'currency-codes';

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

const getCurrencyNameByCode = (code: string) => {
  const currencyInfo = FiatCurrencyInfo.code(code);

  return isDefined(currencyInfo) ? currencyInfo.currency : '???';
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
