import { useSelector } from 'react-redux';

import { DisplaySettingsRootState, DisplaySettingsState } from './display-settings-state';

export const useDisplaySettingsSelector = () =>
  useSelector<DisplaySettingsRootState, DisplaySettingsState>(({ displaySettings }) => displaySettings);

export const useThemeSelector = () => useDisplaySettingsSelector().theme;
