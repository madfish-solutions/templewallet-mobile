import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import { HeaderBackButton } from '../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { RpcEnum } from '../../enums/network.enum';
import { updateCurrentNetwork } from '../../utils/network/network.util';
import { RPC } from '../../utils/network/networks';

const nodesButtons = Object.keys(RPC).map(item => ({
  ...RPC[item],
  value: RPC[item].id
}));

export const NodeSettings = () => {
  const [node, setNode] = useState<RpcEnum>(RpcEnum.TEMPLE_DEFAULT);

  const onChangeNodeHandler = (value: RpcEnum) =>
    AsyncStorage.setItem('nodeInstance', value).then(() => updateCurrentNetwork(RPC[value]));

  useEffect(
    () => void AsyncStorage.getItem('nodeInstance').then(data => setNode((data as RpcEnum) ?? RpcEnum.TEMPLE_DEFAULT)),
    []
  );

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />
    },
    []
  );

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup onChange={onChangeNodeHandler} value={node} buttons={nodesButtons} />
    </ScreenContainer>
  );
};
