import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { showErrorToast } from '../../toast/toast.utils';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { WhiteContainer } from '../white-container/white-container';
import { useTopUpOptionStyles } from './top-up-option.styles';

const TEMPORARILY_UNAVAILABLE_MESSAGE = 'Sorry, service is temporarily unavailable. Try again later!';

interface Props {
  title: string;
  iconName: IconNameEnum;
  disabled?: boolean;
  isError?: boolean;
  onPress?: () => void;
}

export const TopUpOption: FC<Props> = ({ title, iconName, disabled, isError, onPress }) => {
  const styles = useTopUpOptionStyles();
  const colors = useColors();

  const handlePress = () => {
    if (isDefined(disabled) && disabled) {
      isDefined(isError) && isError && showErrorToast({ description: TEMPORARILY_UNAVAILABLE_MESSAGE });
    } else {
      isDefined(onPress) && onPress();
    }
  };

  return (
    <>
      <WhiteContainer>
        <View style={styles.providerLogo}>
          <Icon name={iconName} width={formatSize(160)} height={formatSize(40)} color={colors.black} />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.textContainer} onPress={handlePress}>
          <Text style={[styles.actionsContainer, isDefined(disabled) && disabled && styles.disabled]}>{title}</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
    </>
  );
};
