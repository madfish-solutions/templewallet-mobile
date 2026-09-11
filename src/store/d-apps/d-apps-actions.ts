import { createAction } from '@reduxjs/toolkit';

import { CustomDAppInfo } from 'src/interfaces/custom-dapps-info.interface';
import { DAppConnection } from 'src/interfaces/dapp-connection.interface';

import { createActions } from '../create-actions';

export const loadConnectionsActions = createActions<void, DAppConnection[], string>('d-apps/LOAD_CONNECTIONS');
export const removeConnectionAction = createAction<DAppConnection>('d-apps/REMOVE_CONNECTION');

export const abortRequestAction = createAction<string>('d-apps/ABORT_REQUEST');

export const loadDAppsListActions = createActions<void, CustomDAppInfo[], string>('d-apps/LOAD_DAPPS_LIST');

export const loadTokensApyActions = createActions<void, Record<string, number>>('d-apps/LOAD_TOKENS_APY');
