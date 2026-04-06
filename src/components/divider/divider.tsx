import React, { FC } from 'react';
import { View } from 'react-native';

import { formatSize } from 'src/styles/format-size';

interface Props {
  size?: number;
}

export const Divider: FC<Props> = ({ size = formatSize(24) }) => <View style={{ height: size, width: size }} />;
