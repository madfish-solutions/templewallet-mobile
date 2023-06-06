import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { conditionalStyle } from 'src/utils/conditional-style';
import { setTestID } from 'src/utils/test-id.utils';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { useOnRampSmileButtonStyles } from './on-ramp-smile-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'style' | 'onPress' | 'disabled'>, TestIdProps {
  smileIconName: IconNameEnum;
  title: string;
  titleStyle?: StyleProp<TextStyle>;
}

export const OnRampSmileButton: FC<Props> = ({
  smileIconName,
  title,
  disabled,
  style,
  titleStyle,
  onPress,
  testID
}) => {
  const styles = useOnRampSmileButtonStyles();

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.container, conditionalStyle(Boolean(disabled), styles.disabled), style]}
      onPress={onPress}
      {...setTestID(testID)}
    >
      <Icon name={smileIconName} size={formatSize(28)} />
      <Divider size={formatSize(6)} />
      <Text style={[styles.title, conditionalStyle(Boolean(disabled), styles.disabledTitle), titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};
