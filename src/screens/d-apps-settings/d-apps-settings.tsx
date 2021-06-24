import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadPermissionsActions } from '../../store/d-apps/d-apps-actions';
import { usePermissionsSelector } from '../../store/d-apps/d-apps-selectors';
import { PermissionItem } from './permission-item/permission-item';

export const DAppsSettings = () => {
  const dispatch = useDispatch();
  const permissions = usePermissionsSelector();

  useEffect(() => void dispatch(loadPermissionsActions.submit()), []);

  return (
    <ScreenContainer>
      <Label label="Authorized DApps" description="Click on the Trash icon to reset permissions." />
      {permissions.data.length === 0 ? (
        <DataPlaceholder text="No connected DApps where found" />
      ) : (
        permissions.data.map(permission => (
          <PermissionItem key={permission.accountIdentifier} permission={permission} />
        ))
      )}
    </ScreenContainer>
  );
};
