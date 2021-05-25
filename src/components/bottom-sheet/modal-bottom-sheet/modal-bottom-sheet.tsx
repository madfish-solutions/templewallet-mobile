import React, { FC } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';

import { step } from '../../../config/styles';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { TouchableIcon } from '../../icon/touchable-icon/touchable-icon';
import { ScreenContainer } from '../../screen-container/screen-container';
import { BottomSheet } from '../bottom-sheet';
import { BottomSheetControllerProps } from '../use-bottom-sheet-controller';
import { closeIconSize, useModalBottomSheetStyles } from './modal-bottom-sheet.styles';

interface Props extends BottomSheetControllerProps {
  title: string;
}

export const ModalBottomSheet: FC<Props> = ({ title, controller, children }) => {
  const styles = useModalBottomSheetStyles();
  const contentHeight = useWindowDimensions().height - 20 * step;

  return (
    <BottomSheet controller={controller} contentHeight={contentHeight}>
      <View style={styles.root}>
        <View style={styles.headerContainer}>
          <View style={styles.iconSubstitute} />
          <Text style={styles.title}>{title}</Text>
          <TouchableIcon name={IconNameEnum.Close} size={closeIconSize} onPress={controller.close} />
        </View>
        <ScreenContainer isFullScreenMode={true}>{children}</ScreenContainer>
      </View>
    </BottomSheet>
  );
};
