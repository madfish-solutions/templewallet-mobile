import { useField } from 'formik';
import React, { FC } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';

import { EmptyFn } from '../../../../../config/general';
import { TestIdProps } from '../../../../../interfaces/test-id.props';
import { useArtStyles } from './art-style.styles';

interface Props extends TestIdProps {
  title: string;
  width: number;
  active?: boolean;
  disabled?: boolean;
  onPress?: EmptyFn;
  style?: StyleProp<ViewStyle>;
}

export const ArtStyle: FC<Props> = ({ title, width, active = false, disabled = false, onPress, style, testID }) => {
  const styles = useArtStyles();

  const [, , helpers] = useField<string>('artStyle');

  const handlePress = () => {
    helpers.setValue(title);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      style={[styles.root, conditionalStyle(active, styles.active, styles.inactive), { width }, style]}
      testID={testID}
    >
      <View style={styles.iconContainer}>
        <Icon name={IconNameEnum.ArtStyle} size={formatSize(48)} />

        {disabled && (
          <View style={styles.overlay}>
            <View style={styles.label}>
              <Text style={styles.labelText}>Soon</Text>
            </View>
          </View>
        )}
      </View>

      <Text style={[styles.title, conditionalStyle(disabled, styles.disabledTitle)]}>{title}</Text>
    </TouchableOpacity>
  );
};
