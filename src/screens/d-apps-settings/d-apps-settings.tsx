import React, { useEffect, useState } from 'react';
import { Text } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Label } from '../../components/label/label';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { loadPeersActions, loadPermissionsActions } from '../../store/d-apps/d-apps-actions';
import { usePeersSelector, usePermissionsSelector } from '../../store/d-apps/d-apps-selectors';
import { PermissionItem } from './permission-item/permission-item';

export const DAppsSettings = () => {
  const [loadingStarted, setLoadingStarted] = useState(false);
  const dispatch = useDispatch();
  const permissions = usePermissionsSelector();
  const peers = usePeersSelector();
  console.log(permissions.data.length, peers.data.length);

  useEffect(() => {
    dispatch(loadPermissionsActions.submit());
    dispatch(loadPeersActions.submit());
    setLoadingStarted(true);
  }, []);

  const ready = loadingStarted && !permissions.isLoading && !peers.isLoading;

  return (
    <ScreenContainer>
      <Label label="Authorized DApps" description="Click on the Trash icon to reset permissions." />
      {!ready && <Text>Loading...</Text>}
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
