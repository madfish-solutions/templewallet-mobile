import React, { FC } from 'react';

import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AddAssetAddress } from './add-asset-address/add-asset-address';
import { AddAssetInfo } from './add-asset-info/add-asset-info';

export const AddAssetModal: FC = () => {
  const { goBack } = useNavigation();
  const { innerScreenIndex, setInnerScreenIndex } = useInnerScreenProgress(2);

  usePageAnalytic(ModalsEnum.AddAsset);

  return (
    <>
      <ModalStatusBar />
      {innerScreenIndex === 0 && (
        <AddAssetAddress onCloseButtonPress={goBack} onFormSubmitted={() => setInnerScreenIndex(1)} />
      )}
      {innerScreenIndex === 1 && (
        <AddAssetInfo onCancelButtonPress={() => setInnerScreenIndex(0)} onFormSubmitted={goBack} />
      )}
    </>
  );
};
