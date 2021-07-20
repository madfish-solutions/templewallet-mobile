import { ExtendedPeerInfo, PermissionInfo } from '@airgap/beacon-sdk';
import { useSelector } from 'react-redux';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { DAppsRootState } from './d-apps-state';

export const usePermissionsSelector = () =>
  useSelector<DAppsRootState, LoadableEntityState<PermissionInfo[]>>(({ dApps }) => dApps.permissions);

export const usePeersSelector = () =>
  useSelector<DAppsRootState, LoadableEntityState<ExtendedPeerInfo[]>>(({ dApps }) => dApps.peers ?? createEntity([]));
