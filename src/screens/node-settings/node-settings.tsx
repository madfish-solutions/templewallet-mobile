import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import { HeaderBackButton } from '../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { NetworkEnum } from '../../enums/network.enum';
import { updateCurrentNetwork } from '../../utils/network/network.util';
import { NETWORKS } from '../../utils/network/networks';

const nodesButtons = (Object.keys(NETWORKS) as Array<NetworkEnum>).map((item: NetworkEnum) => {
  return { ...NETWORKS[item], value: NETWORKS[item].id };
});

export const NodeSettings = () => {
  const [node, setNode] = useState<NetworkEnum | string>(NetworkEnum.TEMPLE_DEFAULT);
  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />
    },
    []
  );

  const onChangeHandler = (value: NetworkEnum) => {
    AsyncStorage.setItem('networkInstance', value).then(() => updateCurrentNetwork(NETWORKS[value]));
  };

  useEffect(() => {
    AsyncStorage.getItem('networkInstance').then(data => setNode(data ?? NetworkEnum.TEMPLE_DEFAULT));
  }, []);

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup onChange={onChangeHandler} value={node as NetworkEnum} buttons={nodesButtons} />
    </ScreenContainer>
  );
};
