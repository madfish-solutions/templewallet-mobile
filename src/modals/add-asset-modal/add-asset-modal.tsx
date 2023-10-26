import React, { FC } from 'react';

import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { useInnerScreenProgress } from '../../hooks/use-inner-screen-progress';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

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
