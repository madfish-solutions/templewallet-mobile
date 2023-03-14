import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useTopUpOptionStyles } from './top-up-option-new.styles';

interface Props extends TestIdProps {
  title: string;
  iconName: IconNameEnum;
  disabled?: boolean;
  onPress?: () => void;
}

export const TopUpOptionNew: FC<Props> = ({ title, iconName, disabled = false, testID, onPress }) => {
  const styles = useTopUpOptionStyles();
  const colors = useColors();

  const handlePress = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  return (
    <>
      <WhiteContainer>
        <TouchableOpacity onPress={handlePress} style={styles.content} testID={testID}>
          <Icon
            name={iconName}
            width={formatSize(52)}
            height={formatSize(52)}
            color={disabled ? colors.disabled : colors.peach}
          />
          <View style={styles.divider} />
          <Text style={[styles.actionText, disabled && styles.disabled]}>{title}</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
    </>
  );
};
