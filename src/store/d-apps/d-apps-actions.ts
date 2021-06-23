import { PermissionInfo } from '@airgap/beacon-sdk';
import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { createAction } from '@reduxjs/toolkit';

import { ApprovePermissionRequestActionPayloadInterface } from '../../interfaces/approve-permission-request-action-payload.interface';
import { createActions } from '../create-actions';

export const loadPermissionsActions = createActions<void, PermissionInfo[], string>('d-apps/LOAD_PERMISSIONS');
export const removePermissionAction = createAction<string>('d-apps/REMOVE_PERMISSION');

export const approvePermissionRequestAction = createAction<ApprovePermissionRequestActionPayloadInterface>(
  'd-apps/APPROVE_PERMISSION_REQUEST'
);
export const approveSignPayloadRequestAction = createAction<SignPayloadRequestOutput>(
  'd-apps/APPROVE_SIGN_PAYLOAD_REQUEST'
);
export const abortRequestAction = createAction<string>('d-apps/ABORT_REQUEST');
