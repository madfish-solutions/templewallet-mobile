import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import { HeaderBackButton } from '../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { RpcEnum } from '../../enums/network.enum';
import { RpcInterface } from '../../interfaces/network.interface';
import { RPC } from '../../utils/network/rpc-record';
import { updateCurrentRpc } from '../../utils/network/rpc.utils';

const nodesButtons = RPC.map((item: RpcInterface) => ({
  label: item.label,
  value: item.id
}));

export const NodeSettings = () => {
  const [node, setNode] = useState<RpcEnum>(RpcEnum.TEMPLE_DEFAULT);

  const onChangeNodeHandler = (value: RpcEnum) => {
    const selectedRpc = RPC.filter(item => item.id === value);
    AsyncStorage.setItem('nodeInstance', value).then(() => updateCurrentRpc(selectedRpc[0]));
  };

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
