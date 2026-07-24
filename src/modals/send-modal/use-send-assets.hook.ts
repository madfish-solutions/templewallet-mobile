import { ChainIds } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';

import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useShieldedBalanceSelector } from 'src/store/sapling';
import { useAssetExchangeRate, useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { TEZ_SHIELDED_TOKEN_METADATA, TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { useCurrentAccountCollectibles, useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { getDollarValue } from 'src/utils/balance.utils';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { SendAsset } from './send-asset.types';

const TEZOS_NETWORK_NAME = 'Tezos';

const toTezosSendAsset = (token: TokenInterface): SendAsset => {
  const assetSlug = getTokenSlug(token);

  return {
    ...token,
    assetKey: toChainAssetSlug(TempleChainKind.Tezos, ChainIds.MAINNET, assetSlug),
    assetSlug,
    chainKind: TempleChainKind.Tezos,
    chainId: ChainIds.MAINNET,
    networkName: TEZOS_NETWORK_NAME,
    sendStandard: assetSlug === TEZ_SHIELDED_TOKEN_SLUG ? 'shielded-tez' : 'tezos'
  };
};

const compareSendAssets = (first: SendAsset, second: SendAsset) => {
  const firstFiat = isDefined(first.exchangeRate)
    ? getDollarValue(first.balance, first.decimals, first.exchangeRate).toNumber()
    : 0;
  const secondFiat = isDefined(second.exchangeRate)
    ? getDollarValue(second.balance, second.decimals, second.exchangeRate).toNumber()
    : 0;

  if (firstFiat !== secondFiat) {
    return secondFiat - firstFiat;
  }

  const balanceDifference = new BigNumber(second.balance)
    .shiftedBy(-second.decimals)
    .minus(new BigNumber(first.balance).shiftedBy(-first.decimals));

  return balanceDifference.isZero()
    ? first.symbol.localeCompare(second.symbol)
    : balanceDifference.isPositive()
    ? 1
    : -1;
};

export const useSendAssets = (): SendAsset[] => {
  const tezosToken = useTezosTokenOfCurrentAccount();
  const tezosTokens = useCurrentAccountTokens(true);
  const tezosCollectibles = useCurrentAccountCollectibles(true);
  const shieldedBalance = useShieldedBalanceSelector();
  const shieldedExchangeRate = useAssetExchangeRate(TEZ_SHIELDED_TOKEN_SLUG);

  const evmAddress = useAccountAddressForEvm();
  const evmAssets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmBalances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmTokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmCollectiblesMetadata = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    const shieldedToken: TokenInterface | undefined =
      shieldedBalance === '0'
        ? undefined
        : {
            ...TEZ_SHIELDED_TOKEN_METADATA,
            balance: shieldedBalance,
            exchangeRate: shieldedExchangeRate,
            visibility: tezosToken.visibility
          };

    const tezosAssets = uniqBy(
      [tezosToken, ...(shieldedToken ? [shieldedToken] : []), ...tezosTokens, ...tezosCollectibles],
      getTokenSlug
    ).map(toTezosSendAsset);

    if (!evmAddress) {
      return tezosAssets.sort(compareSendAssets);
    }

    const allEvmSlugs = new Set([EVM_TOKEN_SLUG, ...Object.keys(evmAssets), ...Object.keys(evmBalances)]);
    const etherlinkAssets: SendAsset[] = [];

    for (const assetSlug of allEvmSlugs) {
      const isNative = assetSlug === EVM_TOKEN_SLUG;
      const standard = isNative
        ? EvmAssetStandardEnum.NATIVE
        : evmAssets[assetSlug]?.standard ??
          evmTokensMetadata[assetSlug]?.standard ??
          evmCollectiblesMetadata[assetSlug]?.standard;

      if (!standard) {
        continue;
      }

      const collectibleMetadata = evmCollectiblesMetadata[assetSlug];
      const tokenMetadata = evmTokensMetadata[assetSlug];
      const metadata = collectibleMetadata ?? tokenMetadata;
      const [, tokenIdFromSlug] = fromTokenSlug(assetSlug);
      const tokenId = collectibleMetadata?.tokenId ?? tokenIdFromSlug;
      const decimals =
        standard === EvmAssetStandardEnum.ERC721 || standard === EvmAssetStandardEnum.ERC1155
          ? 0
          : isNative
          ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.decimals
          : tokenMetadata?.decimals;

      if (!isDefined(decimals)) {
        continue;
      }

      const usdRate = evmExchangeRates[assetSlug];
      const exchangeRate = isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
      const contractAddress = isNative
        ? undefined
        : ((collectibleMetadata?.address ?? tokenMetadata?.address) as HexString | undefined);
      const symbol =
        (isNative ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol : metadata?.symbol) ??
        collectibleMetadata?.collectibleName ??
        'NFT';
      const name =
        (isNative
          ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.name
          : collectibleMetadata?.collectibleName ?? metadata?.name) ?? symbol;

      etherlinkAssets.push({
        address: `evm:${ETHERLINK_MAINNET_CHAIN_ID}:${assetSlug}`,
        id: 0,
        name,
        symbol,
        decimals,
        iconName: isNative ? IconNameEnum.TezToken : undefined,
        thumbnailUri: isNative
          ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.iconURL
          : collectibleMetadata?.image ?? metadata?.iconURL,
        standard: null,
        visibility: tezosToken.visibility,
        balance: evmBalances[assetSlug] ?? '0',
        exchangeRate,
        assetKey: toChainAssetSlug(TempleChainKind.EVM, ETHERLINK_MAINNET_CHAIN_ID, assetSlug),
        assetSlug,
        chainKind: TempleChainKind.EVM,
        chainId: ETHERLINK_MAINNET_CHAIN_ID,
        networkName: ETHERLINK_MAINNET_CHAIN_SPECS.name,
        sendStandard: standard,
        contractAddress,
        tokenId
      });
    }

    return tezosAssets.concat(etherlinkAssets).sort(compareSendAssets);
  }, [
    tezosToken,
    tezosTokens,
    tezosCollectibles,
    shieldedBalance,
    shieldedExchangeRate,
    evmAddress,
    evmAssets,
    evmBalances,
    evmTokensMetadata,
    evmCollectiblesMetadata,
    evmExchangeRates,
    fiatToUsdRate
  ]);
};
