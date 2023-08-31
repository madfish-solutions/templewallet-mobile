import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { formatSize } from 'src/styles/format-size';
import { KNOWN_TOKENS_SLUGS } from 'src/token/data/token-slugs';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { getTruncatedProps } from 'src/utils/style.util';

import { useEarnOpportunityTokensStyles } from './styles';

interface Props {
  stakeTokens: Array<TokenInterface>;
  rewardToken: TokenInterface;
}

const TOKENS_SYMBOLS_DIVIDER = ' / ';

export const EarnOpportunityTokens: FC<Props> = ({ stakeTokens, rewardToken }) => {
  const styles = useEarnOpportunityTokensStyles();

  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.row, styles.tokensContainer]}>
          {stakeTokens.map((token, index) => (
            <TokenIcon
              key={index}
              iconName={token.iconName}
              thumbnailUri={token.thumbnailUri}
              size={formatSize(32)}
              style={[
                conditionalStyle(index > 0, styles.nextToken),
                conditionalStyle(getTokenSlug(token) === KNOWN_TOKENS_SLUGS.tzBTC, styles.whiteBg)
              ]}
            />
          ))}
          <View style={styles.rewardTokenWrapper}>
            <TokenIcon iconName={rewardToken.iconName} thumbnailUri={rewardToken.thumbnailUri} size={formatSize(20)} />
          </View>
        </View>
        <Divider size={formatSize(14)} />
        <View>
          <Text {...getTruncatedProps(styles.stakeTokenSymbols)}>
            {stakeTokens.length === 1 ? 'Deposit ' : ''}
            {stakeTokens.map(token => token.symbol).join(TOKENS_SYMBOLS_DIVIDER)}
          </Text>
          <Text style={styles.rewardTokenSymbol}>Earn {rewardToken.symbol}</Text>
        </View>
      </View>
    </View>
  );
};
