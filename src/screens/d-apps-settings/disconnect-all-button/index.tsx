import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';
import { useColors } from 'src/styles/use-colors';

import { useDisconnectAllButtonStyles } from './styles';

interface Props extends TestIdProps {
  onPress: EmptyFn;
}

export const DisconnectAllButton = ({ onPress, testID }: Props) => {
  const styles = useDisconnectAllButtonStyles();
  const colors = useColors();

  return (
    <TouchableWithAnalytics
      Component={TouchableOpacity}
      style={styles.root}
      hitSlop={generateHitSlop(formatSize(4))}
      onPress={onPress}
      testID={testID}
    >
      <Text style={styles.text}>Disconnect all</Text>
      <IconV2 name={IconNameV2Enum.LinkNo} size={16} color={colors.destructive} />
    </TouchableWithAnalytics>
  );
};
