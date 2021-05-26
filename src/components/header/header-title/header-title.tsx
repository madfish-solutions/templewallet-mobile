import React, { FC } from 'react';
import { Text } from 'react-native';

import { useHeaderTitleStyles } from './header-title.styles';

interface Props {
  title: string;
}

export const HeaderTitle: FC<Props> = ({ title }) => {
  const styles = useHeaderTitleStyles();

  return <Text style={styles.title}>{title}</Text>;
};
