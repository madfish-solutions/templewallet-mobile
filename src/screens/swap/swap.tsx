import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { TokensInputsEnum, useFilteredSwapTokensList } from 'src/hooks/use-filtered-swap-tokens.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { useSendAssets } from 'src/modals/send-modal/hooks/use-send-assets';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId
} from 'src/store/wallet/wallet-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { getAssetKey, getAssetSlug } from 'src/utils/asset.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { SwapAssetsContext } from './components/swap-assets-context';
import { EvmSwapForm } from './evm-swap-form/evm-swap-form';
import { useEvmSwapCatalog } from './evm-swap-form/use-evm-swap-catalog';
import { TezosSwapForm } from './tezos-swap-form/tezos-swap-form';

type SwapParams = ScreensParamList[ScreensEnum.SwapScreen];

const SwapScreenForm: FC<{ initialParams: SwapParams }> = ({ initialParams }) => {
  const dispatch = useDispatch();
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const [params, setParams] = useState(initialParams);
  const evm = params?.chainKind === TempleChainKind.EVM || (!tezosAddress && Boolean(evmAddress));
  const evmParams = params?.chainKind === TempleChainKind.EVM ? params : undefined;
  const tezosParams = params?.chainKind !== TempleChainKind.EVM ? params : undefined;
  const { filteredTokensList: tezosAssets } = useFilteredSwapTokensList(TokensInputsEnum.From);
  const evmAssets = useEvmSwapCatalog();
  const ownedAssets = useSendAssets();
  const inputAssets = useMemo(() => {
    const ownedKeys = new Set(ownedAssets.map(getAssetKey));

    return [...(tezosAddress ? tezosAssets : []), ...(evmAddress ? evmAssets : [])].filter(asset =>
      ownedKeys.has(getAssetKey(asset))
    );
  }, [evmAddress, evmAssets, ownedAssets, tezosAddress, tezosAssets]);

  useEffect(() => {
    dispatch(resetSwapParamsAction());

    return () => {
      dispatch(resetSwapParamsAction());
    };
  }, [dispatch, evm]);

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
