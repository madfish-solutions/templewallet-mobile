import React from 'react';
import { View } from 'react-native';

import { INITIAL_APR_VALUE } from 'src/apis/youves/constants';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { TokenTag } from '../token-tag/token-tag';
import { TruncatedText } from '../truncated-text';

import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FCWithChildren<TokenContainerProps> = ({
  token,
  leadingIcon,
  showTokenTag = true,
  apy = INITIAL_APR_VALUE,
  scam,
  style,
  children
}) => {
  const styles = useTokenContainerStyles();
  const tokenWithMetadata = isTokenWithMetadata(token) ? token : undefined;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftContainer}>
        {leadingIcon ?? <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />}
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <TruncatedText style={styles.symbolText}>{token.symbol}</TruncatedText>
            {showTokenTag && tokenWithMetadata ? <TokenTag token={tokenWithMetadata} scam={scam} apy={apy} /> : null}
          </View>
          <TruncatedText style={styles.nameText}>{token.name}</TruncatedText>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};

const isTokenWithMetadata = (token: TokenContainerProps['token']): token is TokenInterface =>
  'address' in token && 'id' in token && 'visibility' in token;
