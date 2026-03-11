import React from 'react';
import { View } from 'react-native';

import { INITIAL_APR_VALUE } from 'src/apis/youves/constants';
import { formatSize } from 'src/styles/format-size';

import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { TokenTag } from '../token-tag/token-tag';
import { TruncatedText } from '../truncated-text';

import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FCWithChildren<TokenContainerProps> = ({
  token,
  apy = INITIAL_APR_VALUE,
  scam,
  children
}) => {
  const styles = useTokenContainerStyles();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <TruncatedText style={styles.symbolText}>{token.symbol}</TruncatedText>
            <TokenTag token={token} scam={scam} apy={apy} />
          </View>
          <TruncatedText style={styles.nameText}>{token.name}</TruncatedText>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
