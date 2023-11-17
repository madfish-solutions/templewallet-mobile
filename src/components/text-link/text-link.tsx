import React, { FC } from 'react';
import { Text, TextProps } from 'react-native';

import { openUrl } from '../../utils/linking';

import { useTextLinkStyles } from './text-link.styles';

interface Props extends Pick<TextProps, 'style'> {
  url: string;
}

export const TextLink: FC<Props> = ({ url, style, children }) => {
  const styles = useTextLinkStyles();

  return (
    <Text style={[styles.text, style]} onPress={() => openUrl(url)}>
      {children}
    </Text>
  );
};
