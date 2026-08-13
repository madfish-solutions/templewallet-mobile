import { AppMetadata } from '@tezos-x/octez.connect-sdk';
import React, { FC } from 'react';

import { isDefined } from 'src/utils/is-defined';

import { AvatarImage } from '../avatar-image/avatar-image';
import { RobotIcon } from '../robot-icon/robot-icon';

interface Props {
  appMetadata: AppMetadata;
  size?: number;
}

export const AppMetadataIcon: FC<Props> = ({ appMetadata, size }) => {
  return isDefined(appMetadata.icon) ? (
    <AvatarImage uri={appMetadata.icon} size={size} />
  ) : (
    <RobotIcon seed={appMetadata.senderId} size={size} />
  );
};
