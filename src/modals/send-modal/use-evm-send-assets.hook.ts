import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { SendAsset } from './send-asset.types';

interface CreateEvmSendAssetsParams {
  assets: EvmChainAssetsRecord;
  balances: Record<string, string>;
  exchangeRates: Record<string, number>;
  fiatToUsdRate?: number;
  hasAccount: boolean;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
  visibility: VisibilityEnum;
}

export const createEvmSendAssets = ({
  assets,
  balances,
  exchangeRates,
  fiatToUsdRate,
  hasAccount,
  tokensMetadata,
  visibility
}: CreateEvmSendAssetsParams): SendAsset[] => {
  if (!hasAccount) {
    return [];
  }

  const allEvmSlugs = new Set([EVM_TOKEN_SLUG, ...Object.keys(assets), ...Object.keys(balances)]);
  const sendAssets: SendAsset[] = [];

  for (const assetSlug of allEvmSlugs) {
    const isNative = assetSlug === EVM_TOKEN_SLUG;
    const standard = isNative
      ? EvmAssetStandardEnum.NATIVE
      : assets[assetSlug]?.standard ?? tokensMetadata[assetSlug]?.standard;

    if (!standard) {
      continue;
    }

    const balance = balances[assetSlug] ?? '0';
    if (!new BigNumber(balance).isGreaterThan(0)) {
      continue;
    }

    if (standard === EvmAssetStandardEnum.ERC721 || standard === EvmAssetStandardEnum.ERC1155) {
      continue;
    }

    const tokenMetadata = tokensMetadata[assetSlug];
    const [, tokenIdFromSlug] = fromTokenSlug(assetSlug);
    const decimals = isNative ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.decimals : tokenMetadata?.decimals;

    if (!isDefined(decimals)) {
      continue;
    }

    const usdRate = exchangeRates[assetSlug];
    const exchangeRate = isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
    const contractAddress = !isNative && tokenMetadata?.address !== EVM_TOKEN_SLUG ? tokenMetadata?.address : undefined;
    const symbol = (isNative ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol : tokenMetadata?.symbol) ?? 'Token';
    const name = (isNative ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.name : tokenMetadata?.name) ?? symbol;

    sendAssets.push({
      address: `evm:${ETHERLINK_MAINNET_CHAIN_ID}:${assetSlug}`,
      id: 0,
      name,
      symbol,
      decimals,
      iconName: isNative ? CryptoLogoNameEnum.Tezos : undefined,
      thumbnailUri: isNative ? ETHERLINK_MAINNET_CHAIN_SPECS.currency.iconURL : tokenMetadata?.iconURL,
      standard: null,
      visibility,
      balance,
      exchangeRate,
      assetKey: toChainAssetSlug(TempleChainKind.EVM, ETHERLINK_MAINNET_CHAIN_ID, assetSlug),
      assetSlug,
      chainKind: TempleChainKind.EVM,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      networkName: ETHERLINK_MAINNET_CHAIN_SPECS.name,
      sendStandard: standard,
      contractAddress,
      tokenId: tokenIdFromSlug
    });
  }

  return sendAssets;
};

export const useEvmSendAssets = (visibility: VisibilityEnum): SendAsset[] => {
  const evmAddress = useAccountAddressForEvm();
  const assets = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const tokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const exchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(
    () =>
      createEvmSendAssets({
        assets,
        balances,
        exchangeRates,
        fiatToUsdRate,
        hasAccount: Boolean(evmAddress),
        tokensMetadata,
        visibility
      }),
    [assets, balances, evmAddress, exchangeRates, fiatToUsdRate, tokensMetadata, visibility]
  );
};
