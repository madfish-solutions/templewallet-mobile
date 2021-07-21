import { PermissionInfo } from '@airgap/beacon-sdk';
import { useSelector } from 'react-redux';

import { LoadableEntityState } from '../types';
import { DAppsRootState } from './d-apps-state';

export const usePermissionsSelector = () =>
  useSelector<DAppsRootState, LoadableEntityState<PermissionInfo[]>>(({ dApps }) => dApps.permissions);
