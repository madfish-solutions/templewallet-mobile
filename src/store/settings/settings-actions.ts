import { createAction } from '@reduxjs/toolkit';

import { RpcInterface } from '../../interfaces/rpc.interface';
import { ThemesEnum } from '../../interfaces/theme.enum';

export const changeTheme = createAction<ThemesEnum>('settings/CHANGE_THEME');

export const setIsBiometricsEnabled = createAction<boolean>('settings/SET_IS_BIOMETRICS_ENABLED');
export const disableBiometryPassword = createAction('settings/DISABLE_BIOMETRY_PASSWORD');

export const setIsBalanceHidden = createAction<boolean>('settings/SET_IS_BALANCE_HIDDEN');

export const addCustomRpc = createAction<RpcInterface>('settings/ADD_CUSTOM_RPC');
export const setSelectedRpcUrl = createAction<string>('settings/SET_SELECTED_RPC_URL');

export const setIsPasscode = createAction<boolean>('settings/SET_IS_PASSCODE');
