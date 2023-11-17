import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { loadBakersListActions } from '../../store/baking/baking-actions';
import { useBakerRewardsListSelector, useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [selectedBaker, isBakerSelected] = useSelectedBakerSelector();

  const bakerRewardsList = useBakerRewardsListSelector();

  const handleDelegatePress = () => navigate(ModalsEnum.SelectBaker);

  usePageAnalytic(ScreensEnum.Delegation);

  useEffect(() => void dispatch(loadBakersListActions.submit()), []);

  return (
    <>
      {isBakerSelected ? (
        <SelectedBakerScreen
          baker={selectedBaker}
          bakerRewardsList={bakerRewardsList}
          onRedelegatePress={handleDelegatePress}
        />
      ) : (
        <AboutDelegationScreen onDelegatePress={handleDelegatePress} />
      )}
    </>
  );
};
