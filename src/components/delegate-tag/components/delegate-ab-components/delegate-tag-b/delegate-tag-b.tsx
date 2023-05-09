import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface Props {
  style?: StyleProp<TextStyle>;
}

export const DelegateTagB: FC<Props> = ({ style }) => <Text style={style}>Not Delegated</Text>;
