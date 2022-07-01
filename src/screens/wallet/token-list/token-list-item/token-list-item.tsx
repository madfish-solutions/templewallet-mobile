import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetValueText } from '../../../../components/asset-value-text/asset-value-text';
import { HideBalance } from '../../../../components/hide-balance/hide-balance';
import { TokenContainer } from '../../../../components/token-container/token-container';
import { TokenContainerProps } from '../../../../components/token-container/token-container.props';
import { EmptyFn } from '../../../../config/general';
import { loadRenderTokenBalanceActions } from '../../../../store/wallet/wallet-actions';
import { TEZ_TOKEN_SLUG } from '../../../../token/data/tokens-metadata';
import { getTokenSlug } from '../../../../token/utils/token.utils';
import { useTokenListItemStyles } from './token-list-item.styles';

interface Props extends TokenContainerProps {
  onPress: EmptyFn;
}

export const TokenListItem: FC<Props> = ({ token, apy, onPress }) => {
  const styles = useTokenListItemStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const slug = getTokenSlug(token);
    if (slug !== TEZ_TOKEN_SLUG) {
      dispatch(loadRenderTokenBalanceActions.submit(getTokenSlug(token)));
    }
  }, [dispatch]);

  return (
    <TouchableOpacity onPress={onPress}>
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
};
