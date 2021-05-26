import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { Divider } from '../../divider/divider';
import { useModalHeaderProgressStyles } from './modal-header-progress.styles';
import { ProgressInterface } from './progress.interface';

const progressContainerWidth = formatSize(48);

interface Props {
  progress?: ProgressInterface;
}

export const ModalHeaderProgress: FC<Props> = ({ progress }) => {
  const styles = useModalHeaderProgressStyles();

  if (isDefined(progress)) {
    const { total, current } = progress;
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
  } else {
    return null;
  }
};
