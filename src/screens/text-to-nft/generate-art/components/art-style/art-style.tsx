import { useField } from 'formik';
import React, { memo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useArtStyles } from './art-style.styles';

interface Props extends TestIdProps {
  title: string;
  width: number;
  active?: boolean;
  onPress?: EmptyFn;
  style?: StyleProp<ViewStyle>;
}

export const ArtStyle = memo<Props>(({ title, width, active = false, onPress, style, testID }) => {
  const styles = useArtStyles();

  const [, , helpers] = useField<string>('artStyle');

  const handlePress = () => {
    helpers.setValue(title, false);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.root, conditionalStyle(active, styles.active, styles.inactive), { width }, style]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Icon name={IconNameEnum.ArtStyle} size={formatSize(48)} />
      </View>

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
});
