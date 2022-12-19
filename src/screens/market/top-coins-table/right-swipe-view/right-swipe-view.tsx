import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { addFavouriteToken, deleteFavouriteToken } from '../../../../store/market/market-actions';
import {
  useFavouriteTokensSlugs,
  useMarketCoinSlug
} from '../../../../store/market/market-selectors';
import { useTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { HiddenButton } from '../hidden-button/hidden-button';
import { RightSwipeViewSelectors } from './right-swipe-view.selectors';
import { useRightSwipeViewStyles } from './right-swipe-view.styles';

interface Props {
  id: string;
  onPress: () => void;
}
export const RightSwipeView: FC<Props> = ({ id, onPress }) => {
  const styles = useRightSwipeViewStyles();
  const favouriteTokensSlugs = useFavouriteTokensSlugs();

  const marketCoinSlug = useMarketCoinSlug(id);
  const outputToken = useTokenSelector(marketCoinSlug);

  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const isFavourite = useMemo(() => favouriteTokensSlugs.includes(id), [favouriteTokensSlugs]);

  const handleAddToFavourites = useCallback(() => {
    dispatch(addFavouriteToken(id));
    onPress();
  }, []);

  const handleDeleteFromFavourites = useCallback(() => {
    dispatch(deleteFavouriteToken(id));
    onPress();
  }, []);

  const handleFavoritePress = isFavourite ? handleDeleteFromFavourites : handleAddToFavourites;

  const handleBuyPress = useCallback(() => {
    navigate(ScreensEnum.SwapScreen, { outputToken });
    onPress();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <HiddenButton
        iconName={IconNameEnum.Buy}
        text="Buy"
        disabled={!outputToken}
        onPress={handleBuyPress}
        testID={RightSwipeViewSelectors.ToggleFavouriteToken}
        testIDProperties={{
          id
        }}
      />

      <Divider size={formatSize(1)} />

      <HiddenButton
        iconName={IconNameEnum.Favourite}
        text="Favorites"
        onPress={handleFavoritePress}
        testID={RightSwipeViewSelectors.BuyToken}
        testIDProperties={{
          id
        }}
      />
    </View>
  );
};
