import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { AvatarImage } from '../avatar-image/avatar-image';
import { RobotIcon } from '../robot-icon/robot-icon';

interface Props {
  appMetadata: AppMetadata;
  size?: number;
}

export const AppMetadataIcon: FC<Props> = ({ appMetadata, size = formatSize(44) }) => {
  return isDefined(appMetadata.icon) ? (
    <AvatarImage uri={appMetadata.icon} size={size} />
  ) : (
    <RobotIcon seed={appMetadata.senderId} size={size} />
  );
};
