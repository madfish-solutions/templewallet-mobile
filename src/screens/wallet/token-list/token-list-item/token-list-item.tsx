import React, { memo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { TokenContainer } from 'src/components/token-container/token-container';
import { TokenContainerProps } from 'src/components/token-container/token-container.props';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';

import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress?: EmptyFn;
}

export const TokenListItem = memo<Props>(({ token, scam, apy, onPress }) => {
  const styles = useTokenListItemStyles();
  const navigateToScreen = useNavigateToScreen();

  const handleOnPress = useCallback(() => {
    if (onPress) {
      onPress();

      return;
    }
    navigateToScreen({ screen: ScreensEnum.TokenScreen, params: { token } });
  }, [token, onPress, navigateToScreen]);

  return (
    <TouchableOpacity onPress={handleOnPress} style={styles.container}>
      <TokenContainer token={token} scam={scam} apy={apy}>
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
});
