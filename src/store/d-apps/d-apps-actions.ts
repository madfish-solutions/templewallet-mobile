import { ExtendedPeerInfo, PermissionInfo } from '@airgap/beacon-sdk';
import { SignPayloadRequestOutput } from '@airgap/beacon-sdk/dist/cjs/types/beacon/messages/BeaconRequestOutputMessage';
import { createAction } from '@reduxjs/toolkit';

import { ApproveOperationRequestActionPayloadInterface } from '../../interfaces/approve-operation-request-action-payload.interface';
import { ApprovePermissionRequestActionPayloadInterface } from '../../interfaces/approve-permission-request-action-payload.interface';
import { createActions } from '../create-actions';

export const loadPermissionsActions = createActions<void, PermissionInfo[], string>('d-apps/LOAD_PERMISSIONS');
export const loadPeersActions = createActions<void, ExtendedPeerInfo[], string>('d-apps/LOAD_PEERS');
export const removePermissionAction = createAction<string>('d-apps/REMOVE_PERMISSION');
export const removePeerAction = createAction<string>('d-apps/REMOVE_PEER');

export const approvePermissionRequestAction = createAction<ApprovePermissionRequestActionPayloadInterface>(
  'd-apps/APPROVE_PERMISSION_REQUEST'
);
export const approveSignPayloadRequestAction = createAction<SignPayloadRequestOutput>(
  'd-apps/APPROVE_SIGN_PAYLOAD_REQUEST'
);
export const approveOperationRequestAction = createAction<ApproveOperationRequestActionPayloadInterface>(
  'd-apps/APPROVE_OPERATION_REQUEST'
);
export const abortRequestAction = createAction<string>('d-apps/ABORT_REQUEST');
