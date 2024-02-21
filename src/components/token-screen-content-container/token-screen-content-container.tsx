import React, { FC, ReactElement, useState } from 'react';
import { View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { IconNameEnum } from '../icon/icon-name.enum';
import { ScreenContainer } from '../screen-container/screen-container';
import { IconSegmentControl } from '../segmented-control/icon-segment-control/icon-segment-control';

import { TokenHeader } from './token-header';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  historyComponent: ReactElement;
  infoComponent: ReactElement;
  token: TokenInterface;
  scam?: boolean;
}

const historyComponentIndex = 0;

export const TokenScreenContentContainer: FC<Props> = ({ historyComponent, infoComponent, token, scam }) => {
  const styles = useTokenScreenContentContainerStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showHistoryComponent = segmentedControlIndex === historyComponentIndex;

  return (
    <>
      <View style={styles.headerContainer}>
        <TokenHeader showHistoryComponent={showHistoryComponent} token={token} scam={scam} />
        <IconSegmentControl
          selectedIndex={segmentedControlIndex}
          values={[IconNameEnum.Clock, IconNameEnum.Info]}
          width={formatSize(94)}
          onChange={setSegmentedControlIndex}
        />
      </View>

      {showHistoryComponent ? historyComponent : <ScreenContainer>{infoComponent}</ScreenContainer>}
    </>
  );
};
