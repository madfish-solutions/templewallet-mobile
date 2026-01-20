import { createAction } from '@reduxjs/toolkit';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { RpcInterface } from 'src/interfaces/rpc.interface';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { FiatCurrenciesEnum } from 'src/utils/exchange-rate.util';

export const changeTheme = createAction<ThemesEnum>('settings/CHANGE_THEME');

export const setIsBiometricsEnabled = createAction<boolean>('settings/SET_IS_BIOMETRICS_ENABLED');
export const disableBiometryPassword = createAction('settings/DISABLE_BIOMETRY_PASSWORD');

export const setIsAnalyticsEnabled = createAction<boolean>('settings/SET_IS_ANALYTICS_ENABLED');

export const setIsBalanceHidden = createAction<boolean>('settings/SET_IS_BALANCE_HIDDEN');

export const addCustomRpc = createAction<RpcInterface>('settings/ADD_CUSTOM_RPC');
export const editCustomRpc = createAction<{ url: string; values: RpcInterface }>('settings/EDIT_CUSTOM_RPC');
export const removeCustomRpc = createAction<string>('settings/REMOVE_CUSTOM_RPC');
export const setSelectedRpcUrl = createAction<string>('settings/SET_SELECTED_RPC_URL');
export const setFiatCurrency = createAction<FiatCurrenciesEnum>('settings/SET_FIAT_CURRENCY');
export const setSlippage = createAction<number>('settings/SET_SLIPPAGE');

export const toggleDomainAddressShown = createAction<void>('settings/TOGGLE_DOMAIN_ADDRESS_SHOWN');
export const setIsDomainAddressShown = createAction<boolean>('settings/SET_IS_DOMAIN_ADDRESS_SHOWN');

export const setZeroBalancesShown = createAction<boolean>('settings/SET_ZERO_BALANCES_SHOWN');

export const showLoaderAction = createAction('settings/SHOW_LOADER_ACTION');
export const hideLoaderAction = createAction('settings/HIDE_LOADER_ACTION');
export const setIsShowLoaderAction = createAction<boolean>('settings/SET_IS_SHOW_LOADER_ACTION');

export const resetPermanentInitialSettingsAction = createAction('settings/RESET_PERMANENT_INITIAL_SETTINGS');

export const setIsApkBuildLaunchEventFired = createAction<boolean>('settings/SET_IS_APK_BUILD_LAUNCH_EVENT_FIRED');

export const setIsPushNotificationsEnabledEventFired = createAction<boolean>(
  'settings/SET_IS_PUSH_NOTIFICATIONS_ENABLED_EVENT_FIRED'
);

export const requestSeedPhraseBackupAction = createAction<void>('settings/REQUEST_SEED_PHRASE_BACKUP_ACTION');
export const madeManualBackupAction = createAction<void>('settings/MADE_MANUAL_BACKUP_ACTION');
export const madeCloudBackupAction = createAction<void>('settings/MADE_CLOUD_BACKUP_ACTION');

export const setOnRampOverlayStateAction = createAction<OnRampOverlayState>(
  'settings/SET_ON_RAMP_OVERLAY_STATE_ACTION'
);

export const walletOpenedAction = createAction<void>('settings/APPLICATION_OPENED_ACTION');

export const switchIsShowCollectibleInfoAction = createAction('settings/SET_IS_SHOW_COLLECTIBLE_INFO_ACTION');

export const setIsInAppUpdateAvailableAction = createAction<boolean>('settings/SET_IS_IN_APP_UPDATE_AVAILABLE_ACTION');

export const setIsInAppBrowserEnabledAction = createAction<boolean>('settings/SET_IS_IN_APP_BROWSER_ENABLED_ACTION');

export const setKoloCardAnimationShownAction = createAction('settings/SET_KOLO_CARD_ANIMATION_SHOWN_ACTION');

export const setKoloForceLogoutOnNextOpenAction = createAction<boolean>(
  'settings/SET_KOLO_FORCE_LOGOUT_ON_NEXT_OPEN_ACTION'
);
