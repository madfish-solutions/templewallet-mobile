import { BigNumber } from 'bignumber.js';
import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from 'src/styles/format-size';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { getTruncatedProps } from 'src/utils/style.util';

import { getDelegateText } from '../../utils/get-delegate-text.util';
import { Divider } from '../divider/divider';
import { TokenIcon } from '../token-icon/token-icon';
import { useApyStyles } from '../token-screen-content-container/apy.styles';
import { TokenContainerProps } from './token-container.props';
import { useTokenContainerStyles } from './token-container.styles';

export const TokenContainer: FC<TokenContainerProps> = ({ token, apy, children }) => {
  const styles = useTokenContainerStyles();
  const apyStyles = useApyStyles();
  const tokenSlug = getTokenSlug(token);

  const label = getDelegateText(token);

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TokenIcon iconName={token.iconName} thumbnailUri={token.thumbnailUri} />
        <Divider size={formatSize(8)} />
        <View style={styles.infoContainer}>
          <View style={styles.symbolContainer}>
            <Text {...getTruncatedProps(styles.symbolText)}>{token.symbol}</Text>
            {isDefined(apy) && apy > 0 && (
              <View style={[styles.apyContainer, apyStyles[tokenSlug]]}>
                <Text style={styles.apyText}>{`${label}: ${new BigNumber(apy).decimalPlaces(2).toFixed(2)}%`}</Text>
              </View>
            )}
          </View>
          <Text {...getTruncatedProps(styles.nameText)}>{token.name}</Text>
        </View>
        <Divider size={formatSize(8)} />
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};
