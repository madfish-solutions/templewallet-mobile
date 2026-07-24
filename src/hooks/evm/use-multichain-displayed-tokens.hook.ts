import { ChainIds } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
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
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { useAccountTkeyToken, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { getDollarValue } from 'src/utils/balance.utils';
import { isEvmCollectibleSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

const etherlinkNativeCurrency = ETHERLINK_MAINNET_CHAIN_SPECS.currency;

export interface MultichainDisplayedToken {
  slug: string;
  chainKind: TempleChainKind;
  chainId: string | number;
  symbol: string;
  name: string;
  iconUri?: string;
  atomicBalance: string;
  decimals: number;
  fiatValue: number | undefined;
  /** Set only on the TEZ gas-token row, whose atomicBalance is the combined public + shielded amount */
  shieldedAtomicBalance?: string;
  original?: TokenInterface;
}

const buildTezosDisplayedToken = (
  token: TokenInterface,
  fiatValue: number | undefined,
  shieldedAtomicBalance?: string
): MultichainDisplayedToken => ({
  slug: getTokenSlug(token),
  chainKind: TempleChainKind.Tezos,
  chainId: ChainIds.MAINNET,
  symbol: token.symbol,
  name: token.name,
  iconUri: token.thumbnailUri,
  atomicBalance: token.balance,
  decimals: token.decimals,
  fiatValue,
  shieldedAtomicBalance,
  original: token
});

const getAtomicBalanceAsNumber = ({ atomicBalance, decimals }: MultichainDisplayedToken) =>
  mutezToTz(new BigNumber(atomicBalance), decimals).toNumber();

interface SortableDisplayedToken {
  token: MultichainDisplayedToken;
  balanceForSort: number;
}

const compareDisplayedTokens = (a: SortableDisplayedToken, b: SortableDisplayedToken) => {
  const aFiat = a.token.fiatValue ?? 0;
  const bFiat = b.token.fiatValue ?? 0;

  if (aFiat !== bFiat) {
    return bFiat - aFiat;
  }

  if (a.balanceForSort !== b.balanceForSort) {
    return b.balanceForSort - a.balanceForSort;
  }

  return a.token.symbol.localeCompare(b.token.symbol);
};

export const useMultichainDisplayedTokens = (): MultichainDisplayedToken[] => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const tkeyToken = useAccountTkeyToken();
  const visibleTokensList = useCurrentAccountTokens(true);
  const getExchangeRate = useTokenExchangeRateGetter();

  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const evmBalances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmAssets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const shieldedBalanceMutez = useShieldedBalanceSelector();

  return useMemo(() => {
    const accountTezosTokens = tezosAddress == null ? [] : [tezosToken, tkeyToken].concat(visibleTokensList);
    const tezosTokens = uniqBy(accountTezosTokens, getTokenSlug).map(token => {
      const slug = getTokenSlug(token);
      const isGasToken = slug === TEZ_TOKEN_SLUG;
      // The gas-token row displays and sorts by the combined public + shielded balance
      const balance = isGasToken ? new BigNumber(token.balance).plus(shieldedBalanceMutez).toFixed() : token.balance;
      const exchangeRate = token.exchangeRate ?? getExchangeRate(slug);
      const fiatValue = isDefined(exchangeRate)
        ? getDollarValue(balance, token.decimals, exchangeRate).toNumber()
        : undefined;

      return buildTezosDisplayedToken(
        { ...token, balance, exchangeRate },
        fiatValue,
        isGasToken ? shieldedBalanceMutez : undefined
      );
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
      if (!isPositiveNumber(atomicBalance) && evmAssets[slug]?.manual !== true) {
        continue;
      }

      const isNative = slug === EVM_TOKEN_SLUG;
      const standard = isNative
        ? EvmAssetStandardEnum.NATIVE
        : evmAssets[slug]?.standard ?? evmMetadata[slug]?.standard;
      const isFungible = standard === EvmAssetStandardEnum.NATIVE || standard === EvmAssetStandardEnum.ERC20;
      if (!isFungible || isEvmCollectibleSlug(slug)) {
        continue;
      }

      const nativeCurrency = isNative ? etherlinkNativeCurrency : undefined;
      const metadata = evmMetadata[slug];
      const decimals = nativeCurrency?.decimals ?? metadata?.decimals;
      if (decimals == null) {
        continue;
      }
      const symbol = nativeCurrency?.symbol ?? metadata?.symbol ?? '';
      const usdRate = evmExchangeRates[slug];
      const fiatRate = isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
      const fiatValue = isDefined(fiatRate) ? getDollarValue(atomicBalance, decimals, fiatRate).toNumber() : undefined;

      evmTokens.push({
        slug,
        chainKind: TempleChainKind.EVM,
        chainId: ETHERLINK_MAINNET_CHAIN_ID,
        symbol,
        name: nativeCurrency?.name ?? metadata?.name ?? symbol,
        iconUri: nativeCurrency?.iconURL ?? metadata?.iconURL,
        atomicBalance,
        decimals,
        fiatValue
      });
    }

    return tezosTokens
      .concat(evmTokens)
      .map(token => ({ token, balanceForSort: getAtomicBalanceAsNumber(token) }))
      .sort(compareDisplayedTokens)
      .map(({ token }) => token);
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
