import React, { FC } from 'react';
import { View } from 'react-native';

import { INITIAL_APR_VALUE } from 'src/apis/youves/constants';
import { formatSize } from 'src/styles/format-size';

import { DelegateTag } from '../delegate-tag/delegate-tag';
import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { TruncatedText } from '../truncated-text';
import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FC<TokenContainerProps> = ({ token, apy = INITIAL_APR_VALUE, children }) => {
  const styles = useTokenContainerStyles();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <TruncatedText style={styles.symbolText}>{token.symbol}</TruncatedText>
            <DelegateTag token={token} apy={apy} />
          </View>
          <TruncatedText style={styles.nameText}>{token.name}</TruncatedText>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
