import { PermissionInfo } from '@airgap/beacon-sdk';
import { createAction } from '@reduxjs/toolkit';

import { CustomDAppInfo } from '../../interfaces/custom-dapps-info.interface';
import { createActions } from '../create-actions';

export const loadPermissionsActions = createActions<void, PermissionInfo[], string>('d-apps/LOAD_PERMISSIONS');
export const removePermissionAction = createAction<PermissionInfo>('d-apps/REMOVE_PERMISSION');

export const abortRequestAction = createAction<string>('d-apps/ABORT_REQUEST');

export const loadDAppsListActions = createActions<void, CustomDAppInfo[], string>('d-apps/LOAD_DAPPS_LIST');

export const loadQuipuApyActions = createActions<void, number, string>('assets/LOAD_QUIPU_APY');
