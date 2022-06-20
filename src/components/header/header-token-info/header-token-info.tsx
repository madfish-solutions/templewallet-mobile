import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { TokenMetadataInterface } from '../../../token/interfaces/token-metadata.interface';
import { isString } from '../../../utils/is-string';
import { getTruncatedProps } from '../../../utils/style.util';
import { TokenIcon } from '../../token-icon/token-icon';
import { useHeaderTokenInfoStyles } from './header-token-info.styles';

interface Props {
  token: TokenMetadataInterface;
}

export const HeaderTokenInfo: FC<Props> = ({ token }) => {
  const styles = useHeaderTokenInfoStyles();

  const subtitle = isString(token.name) ? token.name : token.symbol;

  return (
    <View style={styles.container}>
      <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
      <View style={styles.textContainer}>
        <Text {...getTruncatedProps(styles.title)}>{token.symbol}</Text>
        <Text {...getTruncatedProps(styles.subtitle)}>{subtitle}</Text>
      </View>
    </View>
  );
};
