import React, { useEffect, useState } from 'react';

import { HeaderBackButton } from '../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { StyledRadioButtonsGroup } from '../../components/styled-radio-buttons-group/styled-radio-buttons-group';
import { RpcEnum } from '../../enums/rpc.enum';
import { RpcInterface } from '../../interfaces/rpc.interface';
import { RpcArray } from '../../utils/network/rpc-array';
import { findRpcById, getRpcFromStorage, setRpcIdToStorage, updateCurrentRpc } from '../../utils/network/rpc.utils';

const nodesButtons = RpcArray.map((rpc: RpcInterface) => ({
  label: rpc.label,
  value: rpc.id
}));

export const NodeSettings = () => {
  const [rpcId, setRpcId] = useState<RpcEnum>(RpcEnum.TEMPLE_DEFAULT);

  const onChangeNodeHandler = (newRpcId: RpcEnum) =>
    setRpcIdToStorage(newRpcId).then(() => updateCurrentRpc(findRpcById(newRpcId)));

  useEffect(() => void getRpcFromStorage().then(newRpc => setRpcId(newRpc.id)), []);

  useNavigationSetOptions({ headerLeft: () => <HeaderBackButton /> }, []);

  return (
    <ScreenContainer>
      <StyledRadioButtonsGroup onChange={onChangeNodeHandler} value={rpcId} buttons={nodesButtons} />
    </ScreenContainer>
  );
};
