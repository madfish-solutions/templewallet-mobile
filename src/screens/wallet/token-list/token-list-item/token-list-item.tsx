import React, { FC, memo, useCallback } from 'react';
import { View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { EmptyFn } from '../../../../config/general';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
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
    }, [onPress]);

    return (
      <TouchableWithoutFeedback delayPressIn={50} onPress={handleOnPress}>
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
      </TouchableWithoutFeedback>
    );
  },
  (prevProps, nextProps) => JSON.stringify(prevProps) === JSON.stringify(nextProps)
);
