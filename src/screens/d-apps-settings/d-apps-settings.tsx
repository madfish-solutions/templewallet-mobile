import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadPeersActions, loadPermissionsActions } from '../../store/d-apps/d-apps-actions';
import { usePeersSelector, usePermissionsSelector } from '../../store/d-apps/d-apps-selectors';
import { PermissionItem } from './permission-item/permission-item';

export const DAppsSettings = () => {
  const dispatch = useDispatch();
  const permissions = usePermissionsSelector();
  const peers = usePeersSelector();

  useEffect(() => {
    dispatch(loadPermissionsActions.submit());
    dispatch(loadPeersActions.submit());
  }, []);

  return (
    <ScreenContainer>
      <Label label="Authorized DApps" description="Click on the Trash icon to reset permissions." />
      {permissions.data.length === 0 ? (
        <DataPlaceholder text="No connected DApps where found" />
      ) : (
        permissions.data.map(permission => (
          <PermissionItem
            key={permission.accountIdentifier}
            permission={permission}
            peer={peers.data.find(peer => peer.senderId === permission.senderId)}
          />
        ))
      )}
    </ScreenContainer>
  );
};
