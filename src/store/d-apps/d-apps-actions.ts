import { PermissionInfo } from '@airgap/beacon-sdk';
import { createAction } from '@reduxjs/toolkit';

import { createActions } from '../create-actions';

export const loadPermissionsActions = createActions<void, PermissionInfo[], string>('d-apps/LOAD_PERMISSIONS');
export const removePermissionAction = createAction<PermissionInfo>('d-apps/REMOVE_PERMISSION');

export const abortRequestAction = createAction<string>('d-apps/ABORT_REQUEST');
