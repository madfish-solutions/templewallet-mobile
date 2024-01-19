import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableOpacityComponentProps, TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { useBottomSheetActionButtonStyles } from './bottom-sheet-action-button.styles';

interface Props extends Pick<TouchableOpacityComponentProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  title: string;
  titleStyle?: StyleProp<TextStyle>;
  iconLeftName?: IconNameEnum;
}

export const BottomSheetActionButton: FC<Props> = ({
  title,
  disabled,
  style,
  titleStyle,
  iconLeftName,
  onPress,
  testID
}) => {
  const styles = useBottomSheetActionButtonStyles();

  return (
    <TouchableWithAnalytics
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      {iconLeftName && (
        <>
          <Icon name={iconLeftName} size={formatSize(24)} />
          <Divider size={formatSize(8)} />
        </>
      )}
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle), titleStyle]}>{title}</Text>
    </TouchableWithAnalytics>
  );
};
