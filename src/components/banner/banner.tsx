import React, { FC } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

import { EmptyFn } from '../../config/general';
import { formatSize } from '../../styles/format-size';
import { ButtonLargePrimary } from '../button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from '../button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from '../divider/divider';
import { useBannerStyles } from './banner.styles';

interface Props {
  title: string;
  description: string;
  onEnable: EmptyFn;
  onDisable: EmptyFn;
  enableButtonText?: string;
  disableButtonText?: string;
  style?: StyleProp<ViewStyle>;
}

export const Banner: FC<Props> = ({
  title,
  description,
  onEnable,
  onDisable,
  enableButtonText = 'Enable',
  disableButtonText = 'Disable',
  style
}) => {
  const styles = useBannerStyles();

  return (
    <View style={[styles.root, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.buttons}>
        <ButtonLargeSecondary
          title={disableButtonText}
          onPress={onDisable}
          textStyle={styles.buttonText}
          buttonStyle={styles.button}
          style={styles.buttonContainer}
        />
        <Divider size={formatSize(16)} />
        <ButtonLargePrimary
          title={enableButtonText}
          onPress={onEnable}
          textStyle={styles.buttonText}
          buttonStyle={styles.button}
          style={styles.buttonContainer}
        />
      </View>
    </View>
  );
};
