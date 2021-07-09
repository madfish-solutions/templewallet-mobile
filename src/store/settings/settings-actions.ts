import { createAction } from '@reduxjs/toolkit';

import { ThemesEnum } from '../../interfaces/theme.enum';

export const changeTheme = createAction<ThemesEnum>('settings/CHANGE_THEME');

export const setBiometricsEnabled = createAction<boolean>('settings/SET_BIOMETRICS_ENABLED');
