import React, { FC } from 'react';
import { View } from 'react-native';

import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { formatSize } from 'src/styles/format-size';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { isString } from 'src/utils/is-string';

import { useHeaderTokenInfoStyles } from './header-token-info.styles';

interface Props {
  token: TokenMetadataInterface;
}

export const HeaderTokenInfo: FC<Props> = ({ token }) => {
  const styles = useHeaderTokenInfoStyles();

  const subtitle = isString(token.name) ? token.name : token.symbol;

  return (
    <View style={styles.container}>
      <TokenIcon size={formatSize(40)} iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
      <View style={styles.textContainer}>
        <TruncatedText style={styles.title}>{token.symbol}</TruncatedText>
        <TruncatedText style={styles.subtitle}>{subtitle}</TruncatedText>
      </View>
    </View>
  );
};
