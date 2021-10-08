import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { View } from 'react-native';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { EmptyFn } from '../../../../config/general';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress }) => {
  const styles = useTokenListItemStyles();

  return (
    <TouchableOpacity onPress={onPress}>
      <TokenContainer token={token} apy={apy}>
        <View style={styles.rightContainer}>
          <HideBalance style={styles.balanceText}>
            <AssetValueText asset={token} showSymbol={false} amount={token.balance} />
          </HideBalance>
          <HideBalance style={styles.valueText}>
            <AssetValueText asset={token} convertToDollar amount={token.balance} />
          </HideBalance>
        </View>
      </TokenContainer>
    </TouchableOpacity>
  );
};
