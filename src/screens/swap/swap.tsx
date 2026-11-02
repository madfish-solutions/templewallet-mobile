import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { resetSwapParamsAction } from 'src/store/swap/swap-actions';
import {
  useAccountAddressForEvm,
  useAccountAddressForTezos,
  useCurrentAccountId
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmSwapForm } from './evm-swap-form/evm-swap-form';
import { SwapForm } from './swap-form/swap-form';

export const SwapScreen: FC = () => {
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.SwapScreen);
  const params = useScreenParams<ScreensEnum.SwapScreen>();
  const navigateToScreen = useNavigateToScreen();
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();
  const accountId = useCurrentAccountId();
  const evm = params?.chainKind === TempleChainKind.EVM || (!tezosAddress && Boolean(evmAddress));
  const evmParams = params?.chainKind === TempleChainKind.EVM ? params : undefined;
  const tezosParams = params?.chainKind !== TempleChainKind.EVM ? params : undefined;

  useEffect(() => {
    dispatch(resetSwapParamsAction());
  }, [dispatch, evm]);

  return (
    <>
      {!!tezosAddress && !!evmAddress && (
        <View style={{ padding: formatSize(16) }}>
          <TextSegmentControl
            values={['Tezos', 'Etherlink']}
            selectedIndex={evm ? 1 : 0}
            testID="Swap/Network"
            onChange={index =>
              navigateToScreen({
                screen: ScreensEnum.SwapScreen,
                params:
                  index === 1
                    ? { chainKind: TempleChainKind.EVM, chainId: ETHERLINK_MAINNET_CHAIN_ID }
                    : { chainKind: TempleChainKind.Tezos }
              })
            }
          />
        </View>
      )}
      {evm && evmParams && evmParams.chainId !== ETHERLINK_MAINNET_CHAIN_ID ? (
        <DataPlaceholder text="Swaps support Etherlink mainnet only." />
      ) : evm ? (
        <EvmSwapForm
          key={`evm-${accountId}-${evmParams?.inputAsset?.slug ?? ''}-${evmParams?.outputAsset?.slug ?? ''}`}
          inputAsset={evmParams?.inputAsset}
          outputAsset={evmParams?.outputAsset}
        />
      ) : (
        <SwapForm
          key={`tezos-${accountId}`}
          inputToken={tezosParams?.inputToken}
          outputToken={tezosParams?.outputToken}
        />
      )}
    </>
  );
};
