import { useSelector } from 'react-redux';

import { SecureSettingsRootState } from './secure-settings-state';

export const useBiometricsEnabledSelector = () =>
  useSelector<SecureSettingsRootState, boolean>(({ secureSettings }) => secureSettings.biometricsEnabled);
