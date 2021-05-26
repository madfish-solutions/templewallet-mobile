import React from 'react';

import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useScreenHeader } from '../../components/header/use-screen-header.hook';
import { emptyBaker } from '../../interfaces/baker.interface';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { AboutDelegationScreen } from './about-delegation-screen/about-delegation-screen';
import { SelectedBakerScreen } from './selected-baker-screen/selected-baker-screen';

export const DelegationScreen = () => {
  const selectedBaker = useSelectedBakerSelector();
  const isEmptyBaker = selectedBaker === emptyBaker;

  useScreenHeader(() => <HeaderTitle title="Delegation" />);

  return isEmptyBaker ? <AboutDelegationScreen /> : <SelectedBakerScreen baker={selectedBaker} />;
};
