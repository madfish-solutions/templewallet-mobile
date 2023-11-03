import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { loadPermissionsActions } from '../../store/d-apps/d-apps-actions';
import { usePermissionsSelector } from '../../store/d-apps/d-apps-selectors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { PermissionItem } from './permission-item/permission-item';

export const DAppsSettings = () => {
  const dispatch = useDispatch();
  const permissions = usePermissionsSelector();

  usePageAnalytic(ScreensEnum.DAppsSettings);
  useEffect(() => void dispatch(loadPermissionsActions.submit()), []);

  return (
    <ScreenContainer>
      <Label description="Click on the Trash icon to reset permissions." />
      {permissions.data.length === 0 ? (
        <DataPlaceholder text="No connected DApps were found" />
      ) : (
        permissions.data.map(permission => (
          <PermissionItem key={permission.accountIdentifier} permission={permission} />
        ))
      )}
    </ScreenContainer>
  );
};
