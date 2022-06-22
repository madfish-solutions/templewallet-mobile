import { AppMetadata } from '@airgap/beacon-sdk';
import React, { FC } from 'react';

import { formatSize } from '../../styles/format-size';
import { isDefined } from '../../utils/is-defined';
import { AvatarImage } from '../avatar-image/avatar-image';
import { RobotIcon } from '../robot-icon/robot-icon';

interface Props {
  appMetadata: AppMetadata;
  size?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const defaultIconSize = formatSize(44);

export const AppMetadataIcon: FC<Props> = ({
  appMetadata,
  size,
  maxWidth = defaultIconSize,
  maxHeight = defaultIconSize
}) =>
  isDefined(appMetadata.icon) ? (
    <AvatarImage uri={appMetadata.icon} size={size} maxWidth={maxWidth} maxHeight={maxHeight} />
  ) : (
    <RobotIcon seed={appMetadata.senderId} size={size} />
  );
