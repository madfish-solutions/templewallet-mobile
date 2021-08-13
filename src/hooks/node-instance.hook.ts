import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { NetworkEnum } from '../enums/network.enum';
import { updateCurrentNetwork } from '../utils/network/network.util';
import { NETWORKS } from '../utils/network/networks';

export const useNodeInstanceHook = () => {
  const [node, setNode] = useState<NetworkEnum | string>(NetworkEnum.TEMPLE_DEFAULT);

  const onChangeNodeHandler = (value: NetworkEnum) => {
    AsyncStorage.setItem('networkInstance', value).then(() => updateCurrentNetwork(NETWORKS[value]));
  };

  useEffect(() => {
    AsyncStorage.getItem('networkInstance').then(data => setNode(data ?? NetworkEnum.TEMPLE_DEFAULT));
  }, []);

  return { node, onChangeNodeHandler };
};
