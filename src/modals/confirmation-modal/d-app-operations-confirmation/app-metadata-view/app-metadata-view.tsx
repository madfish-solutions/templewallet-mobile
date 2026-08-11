import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';

import { AppMetadataView as SharedAppMetadataView } from '../../app-metadata-view';

interface Props {
  appMetadata: AppMetadata;
}

export const AppMetadataView: FC<Props> = ({ appMetadata }) => (
  <SharedAppMetadataView name={appMetadata.name} iconUri={appMetadata.icon} iconSeed={appMetadata.senderId} />
);
