import React, { FC } from 'react';

import { TruncatedText } from 'src/components/truncated-text';
import { conditionalStyle } from 'src/utils/conditional-style';

import { useHeaderTitleStyles } from './header-title.styles';

interface Props {
  title: string;
  isWhite?: boolean;
}

export const HeaderTitle: FC<Props> = ({ title, isWhite = false }) => {
  const styles = useHeaderTitleStyles();

  return <TruncatedText style={[styles.title, conditionalStyle(isWhite, styles.whiteColor)]}>{title}</TruncatedText>;
};
