import { ChainIds } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';

import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useShieldedBalanceSelector } from 'src/store/sapling';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { DEFAULT_EVM_CHAINS_SPECS } from 'src/types/networks';
import { useAccountTkeyToken, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { getDollarValue } from 'src/utils/balance.utils';
import { isDefined } from 'src/utils/is-defined';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

const etherlinkNativeCurrency = DEFAULT_EVM_CHAINS_SPECS.find(
  specs => specs.chainId === ETHERLINK_MAINNET_CHAIN_ID
)?.currency;

export interface MultichainDisplayedToken {
  slug: string;
  chainKind: 'tezos' | 'evm';
  chainId: string | number;
  symbol: string;
  name: string;
  iconUri?: string;
  atomicBalance: string;
  decimals: number;
  fiatValue: number | undefined;
  original?: TokenInterface;
}

const EMPTY_EVM_ADDRESS: HexString = '0x';

const buildTezosDisplayedToken = (token: TokenInterface, fiatValue: number | undefined): MultichainDisplayedToken => ({
  slug: getTokenSlug(token),
  chainKind: 'tezos',
  chainId: ChainIds.MAINNET,
  symbol: token.symbol,
  name: token.name,
  iconUri: token.thumbnailUri,
  atomicBalance: token.balance,
  decimals: token.decimals,
  fiatValue,
  original: token
});

const getAtomicBalanceAsNumber = ({ atomicBalance, decimals }: MultichainDisplayedToken) =>
  mutezToTz(new BigNumber(atomicBalance), decimals).toNumber();

const compareDisplayedTokens = (a: MultichainDisplayedToken, b: MultichainDisplayedToken) => {
  const aFiat = a.fiatValue ?? 0;
  const bFiat = b.fiatValue ?? 0;

  const aRated = aFiat > 0;
  const bRated = bFiat > 0;

  if (aRated !== bRated) {
    return aRated ? -1 : 1;
  }

  if (aFiat !== bFiat) {
    return bFiat - aFiat;
  }

  const aBalance = getAtomicBalanceAsNumber(a);
  const bBalance = getAtomicBalanceAsNumber(b);

  if (aBalance !== bBalance) {
    return bBalance - aBalance;
  }

  return a.symbol.localeCompare(b.symbol);
};

export const useMultichainDisplayedTokens = (): MultichainDisplayedToken[] => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const tkeyToken = useAccountTkeyToken();
  const visibleTokensList = useCurrentAccountTokens(true);
  const getExchangeRate = useTokenExchangeRateGetter();

  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const evmAccount = evmAddress ?? EMPTY_EVM_ADDRESS;
  const evmBalances = useEvmAccountChainBalancesSelector(evmAccount, ETHERLINK_MAINNET_CHAIN_ID);
  const evmAssets = useEvmAccountChainAssetsSelector(evmAccount, ETHERLINK_MAINNET_CHAIN_ID);
  const evmMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const shieldedBalanceMutez = useShieldedBalanceSelector();

  return useMemo(() => {
    const accountTezosTokens = tezosAddress == null ? [] : [tezosToken, tkeyToken, ...visibleTokensList];
    const tezosTokens = uniqBy(accountTezosTokens, getTokenSlug).map(token => {
      const slug = getTokenSlug(token);
      // The gas-token row displays and sorts by the combined public + shielded balance
      const balance =
        slug === TEZ_TOKEN_SLUG ? new BigNumber(token.balance).plus(shieldedBalanceMutez).toFixed() : token.balance;
      const exchangeRate = token.exchangeRate ?? getExchangeRate(slug);
      const fiatValue = isDefined(exchangeRate)
        ? getDollarValue(balance, token.decimals, exchangeRate).toNumber()
        : undefined;

      return buildTezosDisplayedToken({ ...token, balance, exchangeRate }, fiatValue);
    });

    const evmTokens: MultichainDisplayedToken[] = [];

    // Manually added assets are displayed even with a zero balance
    const evmSlugs = new Set(Object.keys(evmBalances));
    for (const slug in evmAssets) {
      if (evmAssets[slug].manual) {
        evmSlugs.add(slug);
      }
    }

    for (const slug of evmSlugs) {
      const atomicBalance = evmBalances[slug] ?? '0';
      if (Number(atomicBalance) <= 0 && evmAssets[slug]?.manual !== true) {
        continue;
      }

      const isNative = slug === EVM_TOKEN_SLUG;
      const standard = isNative
        ? EvmAssetStandardEnum.NATIVE
        : evmAssets[slug]?.standard ?? evmMetadata[slug]?.standard;
      const isFungible = standard === EvmAssetStandardEnum.NATIVE || standard === EvmAssetStandardEnum.ERC20;
      if (!isFungible || slug.includes('_')) {
        continue;
      }

      const nativeCurrency = isNative ? etherlinkNativeCurrency : undefined;
      const metadata = evmMetadata[slug];
      const decimals = nativeCurrency?.decimals ?? metadata?.decimals ?? 18;
      const symbol = nativeCurrency?.symbol ?? metadata?.symbol ?? '';
      const usdRate = evmExchangeRates[slug];
      const fiatRate = isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
      const fiatValue = isDefined(fiatRate) ? getDollarValue(atomicBalance, decimals, fiatRate).toNumber() : undefined;

      evmTokens.push({
        slug,
        chainKind: 'evm',
        chainId: ETHERLINK_MAINNET_CHAIN_ID,
        symbol,
        name: nativeCurrency?.name ?? metadata?.name ?? symbol,
        iconUri: nativeCurrency?.iconURL ?? metadata?.iconUri,
        atomicBalance,
        decimals,
        fiatValue
      });
    }

    return tezosTokens.concat(evmTokens).sort(compareDisplayedTokens);
  }, [
    tezosAddress,
    tezosToken,
    tkeyToken,
    visibleTokensList,
    getExchangeRate,
    shieldedBalanceMutez,
    evmBalances,
    evmAssets,
    evmMetadata,
    evmExchangeRates,
    fiatToUsdRate
  ]);
};
