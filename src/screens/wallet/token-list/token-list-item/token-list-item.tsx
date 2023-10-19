import React, { FC, memo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { TokenContainer } from 'src/components/token-container/token-container';
import { TokenContainerProps } from 'src/components/token-container/token-container.props';
import { EmptyFn } from 'src/config/general';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { jsonEqualityFn } from 'src/utils/store.utils';

import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress?: EmptyFn;
}

export const TokenListItem: FC<Props> = memo(
  ({ token, apy, onPress }) => {
    const styles = useTokenListItemStyles();
    const { navigate } = useNavigation();

    const handleOnPress = useCallback(() => {
      if (onPress) {
        onPress();

        return;
      }
      navigate(ScreensEnum.TokenScreen, { token });
    }, [navigate, onPress, token]);

    return (
      <TouchableOpacity onPress={handleOnPress} style={styles.container}>
        <TokenContainer token={token} apy={apy}>
          <View style={styles.rightContainer}>
            <HideBalance style={styles.balanceText}>
              <AssetValueText asset={token} amount={token.balance} showSymbol={false} />
            </HideBalance>
            <HideBalance style={styles.valueText}>
              <AssetValueText asset={token} convertToDollar amount={token.balance} />
            </HideBalance>
          </View>
        </TokenContainer>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => jsonEqualityFn(prevProps, nextProps)
);
