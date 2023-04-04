import React, { FC, memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { WhiteContainer } from 'src/components/white-container/white-container';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useTopUpOptionStyles } from './top-up-option.styles';

interface Props extends TestIdProps {
  title: string;
  iconName: IconNameEnum;
  onPress?: () => void;
}

export const TopUpOption: FC<Props> = memo(({ title, iconName, testID, onPress }) => {
  const styles = useTopUpOptionStyles();
  const colors = useColors();

  return (
    <>
      <WhiteContainer>
        <TouchableOpacity onPress={onPress} style={styles.content} testID={testID}>
          <Icon name={iconName} width={formatSize(52)} height={formatSize(52)} color={colors.peach} />
          <View style={styles.divider} />
          <Text style={styles.actionText}>{title}</Text>
        </TouchableOpacity>
      </WhiteContainer>
      <Divider size={formatSize(16)} />
    </>
  );
});
