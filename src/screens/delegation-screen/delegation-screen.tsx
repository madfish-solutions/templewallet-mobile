import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { loadBakersListActions } from '../../store/baking/baking-actions';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const [selectedBaker, isBakerSelected] = useSelectedBakerSelector();

  const handleDelegatePress = () => navigate(ModalsEnum.SelectBaker);

  useEffect(() => void dispatch(loadBakersListActions.submit()), []);

  return (
    <>
      {isBakerSelected ? (
        <SelectedBakerScreen baker={selectedBaker} onRedelegatePress={handleDelegatePress} />
      ) : (
        <AboutDelegationScreen onDelegatePress={handleDelegatePress} />
      )}
    </>
  );
};
