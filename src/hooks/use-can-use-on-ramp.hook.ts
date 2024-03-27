import { isAndroid } from 'src/config/system';

import { useNetworkInfo } from './use-network-info.hook';

export const useCanUseOnRamp = () => {
  const { isTezosNode } = useNetworkInfo();

  return isTezosNode && isAndroid;
};
