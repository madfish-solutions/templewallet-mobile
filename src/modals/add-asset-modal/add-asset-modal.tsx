import React, { FC, useState } from 'react';

import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AddAssetAddress } from './add-asset-address/add-asset-address';
import { AddAssetInfo } from './add-asset-info/add-asset-info';
import { EvmAssetSuggestion } from './types';

export const AddAssetModal: FC = () => {
  const { goBack } = useNavigation();
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);

  const [network, setNetwork] = useState(TempleChainKind.Tezos);
  const [evmSuggestion, setEvmSuggestion] = useState<EvmAssetSuggestion>();

  usePageAnalytic(ModalsEnum.AddAsset);

  return (
    <>
      <ModalStatusBar />
      {innerScreenIndex === 0 && (
        <AddAssetAddress
          network={network}
          onNetworkSelect={setNetwork}
          onCloseButtonPress={goBack}
          onFormSubmitted={suggestion => {
            setEvmSuggestion(suggestion);
            setInnerScreenIndex(1);
          }}
        />
      )}
      {innerScreenIndex === 1 && (
        <AddAssetInfo
          evmSuggestion={evmSuggestion}
          onCancelButtonPress={() => setInnerScreenIndex(0)}
          onFormSubmitted={goBack}
        />
      )}
    </>
  );
};
