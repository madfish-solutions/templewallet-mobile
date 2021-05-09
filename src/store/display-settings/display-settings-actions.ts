import { createAction } from '@reduxjs/toolkit';

import { ThemesEnum } from '../../interfaces/theme.enum';

export const changeTheme = createAction<ThemesEnum>('display-settings/CHANGE_THEME');
