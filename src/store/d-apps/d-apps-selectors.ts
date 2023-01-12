import { useSelector } from '../selector';

export const usePermissionsSelector = () => useSelector(({ dApps }) => dApps.permissions);

const useDAppsSelector = () => useSelector(({ dApps }) => dApps);

export const useDAppsListSelector = () => useDAppsSelector().dappsList.data;

export const useTokensApyInfoSelector = () => useSelector(({ dApps }) => dApps.tokensApyInfo);
