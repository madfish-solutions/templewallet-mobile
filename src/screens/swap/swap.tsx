import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId,
  useCurrentAccountStoredAssetsSelector
} from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getAssetSlug } from 'src/utils/asset.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { dispatch } from '../../store';

import { SwapAssetsContext } from './components/swap-assets-context';
import { EvmSwapForm } from './evm-swap-form/evm-swap-form';
import { useEvmSwapCatalog } from './evm-swap-form/use-evm-swap-catalog';
import { TezosSwapForm } from './tezos-swap-form/tezos-swap-form';

type SwapParams = ScreensParamList[ScreensEnum.SwapScreen];

const SwapScreenForm: FC<{ initialParams: SwapParams }> = ({ initialParams }) => {
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const [params, setParams] = useState(initialParams);
  const evm = params?.chainKind === TempleChainKind.EVM || (!tezosAddress && Boolean(evmAddress));
  const evmParams = params?.chainKind === TempleChainKind.EVM ? params : undefined;
  const tezosParams = params?.chainKind !== TempleChainKind.EVM ? params : undefined;
  const { filteredTokensList: tezosAssets } = useFilteredSwapTokensList(TokensInputsEnum.From);
  const evmAssets = useEvmSwapCatalog();
  const tezosTokens = useCurrentAccountStoredAssetsSelector('tokens');
  const evmTokens = useEvmAccountChainAssetsSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const evmChain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const inputAssets = useMemo(() => {
    const visibleTezosSlugs = new Set(
      tezosTokens
        .filter(token => token.visibility !== VisibilityEnum.Hidden && new BigNumber(token.balance).gt(0))
        .map(token => token.slug)
    );
    const ownedTezosAssets = tezosAddress
      ? tezosAssets.filter(asset => {
          const slug = getAssetSlug(asset);

          return slug === TEZ_TOKEN_SLUG || visibleTezosSlugs.has(slug);
        })
      : [];
    const ownedEvmAssets =
      evmAddress && evmChain
        ? evmAssets.filter(asset => {
            if (!new BigNumber(asset.balance).gt(0)) return false;
            if (asset.assetSlug === EVM_TOKEN_SLUG) return true;
            const token = evmTokens[asset.assetSlug];
            const metadata = evmMetadata[asset.assetSlug];

            return (
              token?.visibility !== VisibilityEnum.Hidden &&
              (token?.standard ?? metadata?.standard) === EvmAssetStandardEnum.ERC20 &&
              metadata?.decimals != null &&
              Boolean(metadata.address && metadata.address !== EVM_TOKEN_SLUG)
            );
          })
        : [];

    return [...ownedTezosAssets, ...ownedEvmAssets];
  }, [evmAddress, evmAssets, evmChain, evmMetadata, evmTokens, tezosAddress, tezosAssets, tezosTokens]);

  useEffect(() => {
    dispatch(resetSwapParamsAction());

    return () => {
      dispatch(resetSwapParamsAction());
    };
  }, [evm]);

  const onSelectInput = useCallback(
    (asset: AssetInterface): void => {
      if (asset.chainKind === TempleChainKind.EVM && evmAddress) {
        setParams({
          chainKind: TempleChainKind.EVM,
          chainId: ETHERLINK_MAINNET_CHAIN_ID,
          inputAsset: { chainKind: TempleChainKind.EVM, chainId: ETHERLINK_MAINNET_CHAIN_ID, slug: getAssetSlug(asset) }
        });
      } else if (asset.chainKind === TempleChainKind.Tezos && tezosAddress) {
        const inputToken = tezosAssets.find(token => getAssetSlug(token) === getAssetSlug(asset));
        if (inputToken) setParams({ chainKind: TempleChainKind.Tezos, inputToken });
      }
    },
    [evmAddress, tezosAddress, tezosAssets]
  );
  const context = useMemo(() => ({ inputAssets, onSelectInput }), [inputAssets, onSelectInput]);

  return (
    <SwapAssetsContext.Provider value={context}>
      {evm ? (
        <EvmSwapForm inputAsset={evmParams?.inputAsset} outputAsset={evmParams?.outputAsset} />
      ) : (
        <TezosSwapForm inputToken={tezosParams?.inputToken} outputToken={tezosParams?.outputToken} />
      )}
    </SwapAssetsContext.Provider>
  );
};

export const SwapScreen: FC = () => {
  usePageAnalytic(ScreensEnum.SwapScreen);
  const params = useScreenParams<ScreensEnum.SwapScreen>();
  const accountId = useCurrentAccountId();

  return <SwapScreenForm key={`${accountId}-${JSON.stringify(params)}`} initialParams={params} />;
};
