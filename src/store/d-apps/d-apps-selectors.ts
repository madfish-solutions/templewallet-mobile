import { PermissionInfo } from '@airgap/beacon-sdk';
import { useSelector } from 'react-redux';

import { LoadableEntityState } from '../types';
import { DAppsRootState, DAppsState } from './d-apps-state';

export const usePermissionsSelector = () =>
  useSelector<DAppsRootState, LoadableEntityState<PermissionInfo[]>>(({ dApps }) => dApps.permissions);

const useDAppsSelector = () => useSelector<DAppsRootState, DAppsState>(({ dApps }) => dApps);

export const useDAppsListSelector = () => useDAppsSelector().dappsList.data;

export const useTokensApyInfoSelector = () =>
  useSelector<DAppsRootState, DAppsState['tokensApyInfo']>(({ dApps }) => dApps.tokensApyInfo);
