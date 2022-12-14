import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { addFavouriteToken, deleteFavouriteToken } from '../../../../store/market/market-actions';
import { useFavouriteTokens, useMarketCoinSlug } from '../../../../store/market/market-selectors';
import { useTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { HiddenButton } from '../hidden-button/hidden-button';
import { useRightSwipeViewStyles } from './right-swipe-view.styles';

interface Props {
  id: string;
}

export const RightSwipeView: FC<Props> = ({ id }) => {
  const colors = useColors();
  const styles = useRightSwipeViewStyles();
  const favouriteTokens = useFavouriteTokens();

  const marketCoinSlug = useMarketCoinSlug(id);
  const outputToken = useTokenSelector(marketCoinSlug);

  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const isFavourite = useMemo(() => favouriteTokens.includes(id), [favouriteTokens]);
  const handleAddToFavourites = useCallback(() => dispatch(addFavouriteToken(id)), []);
  const handleDeleteFromFavourites = useCallback(() => dispatch(deleteFavouriteToken(id)), []);
  const handlePress = isFavourite ? handleDeleteFromFavourites : handleAddToFavourites;

  return (
    <View style={styles.rootContainer}>
      <HiddenButton
        iconName={IconNameEnum.Buy}
        text="Buy"
        disabled={!outputToken}
        onPress={() => navigate(ScreensEnum.SwapScreen, { outputToken })}
      />
      <Divider size={formatSize(1)} />

      <HiddenButton
        iconName={IconNameEnum.Favourite}
        text="Favorites"
        fill={isFavourite ? colors.peach : undefined}
        onPress={handlePress}
      />
    </View>
  );
};
