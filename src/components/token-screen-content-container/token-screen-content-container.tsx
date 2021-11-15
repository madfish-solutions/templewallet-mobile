import React, { FC, ReactElement, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { delegationApy } from '../../config/general';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useSelectedBakerSelector } from '../../store/baking/baking-selectors';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { Icon } from '../icon/icon';
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
  const { navigate } = useNavigation();
  const [, isBakerSelected] = useSelectedBakerSelector();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showHistoryComponent = segmentedControlIndex === historyComponentIndex;

  return (
    <>
      <View style={styles.headerContainer}>
        {/* <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text> */}
        <TouchableOpacity style={styles.delegateContainer} onPress={() => navigate(ScreensEnum.Delegation)}>
          {!isBakerSelected ? (
            <Text style={styles.delegateText}>Rewards & Redelegate</Text>
          ) : (
            <Text style={styles.delegateText}>
              Delegate: <Text style={styles.apyText}>{delegationApy}% APY</Text>
            </Text>
          )}
        </TouchableOpacity>

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
