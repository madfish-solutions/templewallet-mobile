import { createAction } from '@reduxjs/toolkit';

import { createActions } from './create-actions';
import { NavigationActionParams } from './types';

export const emptyAction = createAction('root/EMPTY_ACTION');

export const resetApplicationAction = createActions('root/RESET_APPLICATION');
export const resetKeychainOnInstallAction = createActions('root/RESET_KEYCHAIN_ON_INSTALL');

export const navigateAction = createAction<NavigationActionParams>('navigation/NAVIGATE');

export const navigateBackAction = createAction('navigation/NAVIGATE_BACK');
