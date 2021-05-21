import React, { FC } from 'react';
import { View } from 'react-native';

import { formatSize } from '../../styles/format-size';

interface Props {
  height?: number;
}

export const Divider: FC<Props> = ({ height = formatSize(24) }) => <View style={{ height }} />;
