import React, { FC, ReactElement, useState } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { IconNameEnum } from '../icon/icon-name.enum';
import { ScreenContainer } from '../screen-container/screen-container';
import { IconSegmentControl } from '../segmented-control/icon-segment-control/icon-segment-control';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  historyComponent: ReactElement;
  infoComponent: ReactElement;
}

const historyComponentIndex = 0;

export const TokenScreenContentContainer: FC<Props> = ({ historyComponent, infoComponent }) => {
  const styles = useTokenScreenContentContainerStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showHistoryComponent = segmentedControlIndex === historyComponentIndex;

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>

        <IconSegmentControl
          selectedIndex={segmentedControlIndex}
          values={[IconNameEnum.Clock, IconNameEnum.Info]}
          width={formatSize(94)}
          onChange={setSegmentedControlIndex}
        />
      </View>

      <ScreenContainer>{showHistoryComponent ? historyComponent : infoComponent}</ScreenContainer>
    </>
  );
};
