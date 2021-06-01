import React, { FC } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { EmptyFn } from '../../../config/general';
import { formatSize } from '../../../styles/format-size';
import { useColors } from '../../../styles/use-colors';
import { Divider } from '../../divider/divider';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { useProtectedOverlayStyle } from './protected-overlay.style';

interface Props {
  onPress: EmptyFn;
}

export const ProtectedOverlay: FC<Props> = ({ onPress }) => {
  const colors = useColors();
  const styles = useProtectedOverlayStyle();

  return (
    <View style={styles.container}>
      <Image style={styles.protectedBackground} source={require('./protected-background.gif')} />
      <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
        <Icon name={IconNameEnum.Lock} size={formatSize(40)} color={colors.black} />
        <Divider size={formatSize(12)} />
        <Text style={styles.title}>Protected</Text>
        <Divider size={formatSize(4)} />
        <Text style={styles.description}>Tap to reveal</Text>
      </TouchableOpacity>
    </View>
  );
};
