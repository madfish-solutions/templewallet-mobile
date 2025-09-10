import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadBakersListActions } from 'src/store/baking/baking-actions';
import { useSelectedBakerSelector } from 'src/store/baking/baking-selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const currentBaker = useSelectedBakerSelector();

  const handleDelegatePress = () => navigate(ModalsEnum.SelectBaker);

  usePageAnalytic(ScreensEnum.Delegation);

  useEffect(() => void dispatch(loadBakersListActions.submit()), []);

  return (
    <>
      {currentBaker ? (
        <SelectedBakerScreen baker={currentBaker} onRedelegatePress={handleDelegatePress} />
      ) : (
        <AboutDelegationScreen onDelegatePress={handleDelegatePress} />
      )}
    </>
  );
};
