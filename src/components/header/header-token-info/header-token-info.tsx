import React, { FC } from 'react';
import { View } from 'react-native';

import { TruncatedText } from 'src/components/truncated-text';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isString } from 'src/utils/is-string';

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
        <TruncatedText style={styles.title}>{token.symbol}</TruncatedText>
        <TruncatedText style={styles.subtitle}>{subtitle}</TruncatedText>
      </View>
    </View>
  );
};
