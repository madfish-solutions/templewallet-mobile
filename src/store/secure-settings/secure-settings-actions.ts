import { createAction } from '@reduxjs/toolkit';

export const setBiometricsEnabled = createAction<boolean>('secure-settings/SET_BIOMETRICS_ENABLED');
