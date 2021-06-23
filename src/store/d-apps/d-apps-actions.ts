import { PermissionInfo } from '@airgap/beacon-sdk';
import { createAction } from '@reduxjs/toolkit';

import { AbortPermissionRequestActionPayloadInterface } from '../../interfaces/abort-permission-request-action-payload.interface';
import { ApprovePermissionRequestActionPayloadInterface } from '../../interfaces/approve-permission-request-action-payload.interface';
import { createActions } from '../create-actions';

export const loadPermissionsActions = createActions<void, PermissionInfo[], string>('d-apps/LOAD_PERMISSIONS');
export const removePermissionAction = createAction<string>('d-apps/REMOVE_PERMISSION');

export const approvePermissionRequestAction = createAction<ApprovePermissionRequestActionPayloadInterface>(
  'd-apps/APPROVE_PERMISSION_REQUEST'
);
export const abortPermissionRequestAction = createAction<AbortPermissionRequestActionPayloadInterface>(
  'd-apps/ABORT_PERMISSION_REQUEST'
);
