import React, { FC } from 'react';
import { Text } from 'react-native';

import { conditionalStyle } from '../../../utils/conditional-style';
import { useHeaderTitleStyles } from './header-title.styles';

interface Props {
  title: string;
  isWhite?: boolean;
}

export const HeaderTitle: FC<Props> = ({ title, isWhite = false }) => {
  const styles = useHeaderTitleStyles();

  return <Text style={[styles.title, conditionalStyle(isWhite, styles.whiteColor)]}>{title}</Text>;
};
