import React, { FC, ReactElement, useState } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { ScreenContainer } from '../screen-container/screen-container';
import { useTokenScreenContentContainerStyles } from './token-screen-content-container.styles';

interface Props {
  historyComponent: ReactElement;
  infoComponent: ReactElement;
}

export const TokenScreenContentContainer: FC<Props> = ({ historyComponent, infoComponent }) => {
  const styles = useTokenScreenContentContainerStyles();
  const colors = useColors();

  const [showHistoryComponent, setShowHistoryComponent] = useState(true);

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{showHistoryComponent ? 'History' : 'Info'}</Text>

        {/* TODO: replace this with tab component after #3661 task will be done */}
        <View style={styles.actionsContainer}>
          <TouchableIcon
            name={IconNameEnum.Clock}
            size={formatSize(16)}
            color={showHistoryComponent ? colors.orange : colors.gray1}
            onPress={() => setShowHistoryComponent(true)}
          />
          <TouchableIcon
            name={IconNameEnum.Info}
            size={formatSize(16)}
            color={showHistoryComponent ? colors.gray1 : colors.orange}
            onPress={() => setShowHistoryComponent(false)}
          />
        </View>
      </View>

      <ScreenContainer>{showHistoryComponent ? historyComponent : infoComponent}</ScreenContainer>
    </>
  );
};
