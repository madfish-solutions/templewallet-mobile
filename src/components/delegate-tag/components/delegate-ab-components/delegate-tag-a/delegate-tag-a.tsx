import React, { FC } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

import { AnimatedAlertIcon } from '../../../../animated-alert-icon/animated-alert-icon';
import { styles } from './delegate-tag-a.styles';

interface Props {
  style?: StyleProp<TextStyle>;
}

export const DelegateTagA: FC<Props> = ({ style }) => (
  <View style={styles.root}>
    <AnimatedAlertIcon style={styles.alertIcon} />
    <Text style={style}>Delegate</Text>
  </View>
);
