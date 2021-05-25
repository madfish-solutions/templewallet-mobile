import React from 'react';

import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const [selectedBaker, isBakerSelected] = useSelectedBakerSelector();

  return isBakerSelected ? <SelectedBakerScreen baker={selectedBaker} /> : <AboutDelegationScreen />;
};
