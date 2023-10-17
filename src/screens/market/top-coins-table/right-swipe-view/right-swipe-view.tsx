import React, { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { isIOS } from 'src/config/system';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { addFavouriteToken, deleteFavouriteToken } from 'src/store/market/market-actions';
import { useFavouriteTokensIdsSelector, useMarketTokenSlugSelector } from 'src/store/market/market-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { useAccountTokenBySlug } from 'src/utils/assets/hooks';

import { HiddenButton } from '../hidden-button/hidden-button';
import { RightSwipeViewSelectors } from './right-swipe-view.selectors';
import { useRightSwipeViewStyles } from './right-swipe-view.styles';

interface Props {
  id: string;
  onPress: EmptyFn;
}

export const RightSwipeView = memo<Props>(({ id, onPress }) => {
  const colors = useColors();
  const styles = useRightSwipeViewStyles();
  const favouriteTokensIds = useFavouriteTokensIdsSelector();

  const marketCoinSlug = useMarketTokenSlugSelector(id);
  const outputToken = useAccountTokenBySlug(marketCoinSlug);

  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const isFavourite = useMemo<boolean>(() => favouriteTokensIds.includes(id), [favouriteTokensIds]);
  const favouriteIconColor = isFavourite ? colors.peach : colors.peach10;
  const buyIconColor = outputToken ? colors.peach : colors.gray1;

  const handleAddToFavourites = () => {
    dispatch(addFavouriteToken(id));
    onPress();
  };

  const handleDeleteFromFavourites = () => {
    dispatch(deleteFavouriteToken(id));
    onPress();
  };

  const handleFavoritePress = isFavourite ? handleDeleteFromFavourites : handleAddToFavourites;

  const handleBuyPress = () => {
    navigate(ScreensEnum.SwapScreen, { outputToken: outputToken });
  };

  return (
    <View style={styles.rootContainer}>
      {!isIOS && (
        <HiddenButton
          iconName={IconNameEnum.Buy}
          text="Buy"
          disabled={!outputToken}
          onPress={handleBuyPress}
          color={buyIconColor}
          testID={RightSwipeViewSelectors.buyTokenButton}
          testIDProperties={{
            id
          }}
        />
      )}

      <Divider size={formatSize(1)} />

      <HiddenButton
        iconName={IconNameEnum.Favourite}
        text="Favorites"
        onPress={handleFavoritePress}
        color={favouriteIconColor}
        testID={RightSwipeViewSelectors.favouriteTokenButton}
        testIDProperties={{
          id,
          newValue: !isFavourite
        }}
      />
    </View>
  );
});
