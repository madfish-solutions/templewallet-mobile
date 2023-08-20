import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

import { AnimatedAlertIcon } from 'src/components/animated-alert-icon/animated-alert-icon';

import { styles } from './delegate-tag-with-icon.styles';

interface Props {
  style?: StyleProp<TextStyle>;
}

export const DelegateTagWithIcon: FC<Props> = ({ style }) => (
  <View style={styles.root}>
    <AnimatedAlertIcon style={styles.alertIcon} />
    <Text style={style}>Delegate</Text>
  </View>
);
