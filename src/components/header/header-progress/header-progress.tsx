import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { Divider } from '../../divider/divider';
import { useHeaderProgressStyles } from './header-progress.styles';

const progressContainerWidth = formatSize(48);

interface Props {
  current: number;
  total: number;
}

export const HeaderProgress: FC<Props> = ({ current, total }) => {
  const styles = useHeaderProgressStyles();

  const progressLineWith = (progressContainerWidth / total) * current;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {current}/{total}
      </Text>

      <Divider height={formatSize(4)} />

      <View style={[styles.progressContainer, { width: progressContainerWidth }]}>
        <View style={[styles.progressLine, { width: progressLineWith }]} />
      </View>
    </View>
  );
};
