import { useSelector } from 'react-redux';

import { ThemesEnum } from '../../interfaces/theme.enum';
import { DisplaySettingsRootState } from './display-settings-state';

export const useThemeSelector = () =>
  useSelector<DisplaySettingsRootState, ThemesEnum>(({ displaySettings }) => displaySettings.theme);
