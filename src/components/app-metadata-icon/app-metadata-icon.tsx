import React, { FC } from 'react';

import { isString } from 'src/utils/is-string';

import { AvatarImage } from '../avatar-image/avatar-image';
import { RobotIcon } from '../robot-icon/robot-icon';

interface Props {
  iconUri?: string;
  iconSeed: string;
  size?: number;
  style?: { borderRadius?: number; borderWidth?: number };
}

export const AppMetadataIcon: FC<Props> = ({ iconUri, iconSeed, size, style }) =>
  isString(iconUri) ? (
    <AvatarImage uri={iconUri} size={size} style={style} />
  ) : (
    <RobotIcon seed={iconSeed} size={size} style={style} />
  );
