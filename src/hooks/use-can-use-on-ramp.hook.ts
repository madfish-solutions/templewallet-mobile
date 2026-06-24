import { LIMIT_FIN_FEATURES } from 'src/config/system';

export const useCanUseOnRamp = () => {
  return !LIMIT_FIN_FEATURES;
};
