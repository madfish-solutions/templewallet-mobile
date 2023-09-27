import React, { FC } from 'react';
import { Text } from 'react-native';

import { openUrl } from '../../utils/linking';
import { useTextLinkStyles } from './text-link.styles';

interface Props {
  url: string;
}

export const BlackTextLink: FC<Props> = ({ url, children }) => {
  const styles = useTextLinkStyles();

  return (
    <Text style={styles.blackText} onPress={() => openUrl(url)}>
      {children}
    </Text>
  );
};
