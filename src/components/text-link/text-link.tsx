import React, { FC } from 'react';
import { Text } from 'react-native';

import { openUrl } from '../../utils/linking.util';
import { useTextLinkStyles } from './text-link.styles';

interface Props {
  url: string;
}

export const TextLink: FC<Props> = ({ url, children }) => {
  const styles = useTextLinkStyles();

  return (
    <Text style={styles.text} onPress={() => openUrl(url)}>
      {children}
    </Text>
  );
};
