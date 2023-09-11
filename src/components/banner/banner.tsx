import React, { FC } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { isDefined } from '../../utils/is-defined';
import { useBannerStyles } from './banner.styles';

interface Props {
  title: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export const Banner: FC<Props> = ({ title, description, style }) => {
  const styles = useBannerStyles();

  return (
    <View style={[styles.root, style]}>
      <Text style={styles.title}>{title}</Text>
      {isDefined(description) && <Text style={styles.description}>{description}</Text>}
    </View>
  );
};
