import { MOONPAY_ASSETS_BASE_URL } from 'src/apis/moonpay/consts';
import {
  CurrencyType as MoonPayCurrencyType,
  CryptoCurrency,
  FiatCurrency as MoonPayFiatCurrency,
  Currency
} from 'src/apis/moonpay/types';
import { MtPelerinCurrenciesResponse } from 'src/apis/mt-pelerin/types';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TopUpProviderCurrencies } from './state';

const EVM_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const irregularMoonPayTokenCodes = [
  { regex: /^usd1/, iconName: 'usd1.png' },
  { regex: /^pyusd/, iconName: 'paypal-usd-pyusd-logo.svg' },
  { regex: /^(pol_polygon|pol)$/, iconName: 'matic.svg' }
];

const toContractAddressOrNative = (address?: string | null) => {
  if (!address?.trim()) {
    return null;
  }

  return address.toLowerCase() === EVM_ZERO_ADDRESS ? null : address;
};

const getMoonPayIconUrl = (code: string) => {
  const normalizedCode = code.toLowerCase();
  const exception = irregularMoonPayTokenCodes.find(({ regex }) => regex.test(normalizedCode));

  return `${MOONPAY_ASSETS_BASE_URL}/widget/currencies/${exception?.iconName ?? `${normalizedCode}.svg`}`;
};

export const mapMoonPayProviderCurrencies = (currencies: Currency[]): TopUpProviderCurrencies => ({
  fiat: currencies
    .filter(
      (currency): currency is MoonPayFiatCurrency =>
        currency.type === MoonPayCurrencyType.Fiat && currency.isSellSupported
    )
    .map(({ name, code, minBuyAmount, maxBuyAmount, precision }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      icon: getMoonPayIconUrl(code),
      minAmount: minBuyAmount,
      maxAmount: maxBuyAmount,
      precision: Math.min(precision, 2)
    })),
  crypto: currencies
    .filter(
      (currency): currency is CryptoCurrency =>
        currency.type === MoonPayCurrencyType.Crypto &&
        currency.supportsLiveMode &&
        !currency.isSuspended &&
        currency.metadata.networkCode.toLowerCase() === 'tezos'
    )
    .map(({ name, code, precision, minBuyAmount, maxBuyAmount, metadata }) => ({
      name,
      code: code.toUpperCase(),
      codeToDisplay: code.toUpperCase().split('_')[0],
      icon: getMoonPayIconUrl(code),
      minAmount: minBuyAmount ?? undefined,
      maxAmount: maxBuyAmount ?? undefined,
      precision,
      slug: toTokenSlug(toContractAddressOrNative(metadata.contractAddress), metadata.coinType ?? undefined)
    }))
});

export const mapMtPelerinProviderCurrencies = ({
  cryptoTokens,
  fiatCurrencies
}: MtPelerinCurrenciesResponse): TopUpProviderCurrencies => ({
  fiat: fiatCurrencies
    .filter(({ isBuySupported }) => isBuySupported)
    .map(({ name, symbol, iconUrl }) => ({
      name,
      code: symbol.toUpperCase(),
      icon: iconUrl,
      precision: 2
    })),
  crypto: cryptoTokens
    .filter(({ network }) => network === 'tezos_mainnet')
    .map(({ symbol, name, iconUrl, decimals, address, tokenId }) => ({
      name,
      code: symbol,
      icon: iconUrl,
      precision: decimals,
      slug: toTokenSlug(toContractAddressOrNative(address), tokenId)
    }))
});
