import React, { FC, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { isIOS } from 'src/config/system';

import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { EmptyFn } from '../../../../config/general';
import { ScreensEnum } from '../../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { addFavouriteToken, deleteFavouriteToken } from '../../../../store/market/market-actions';
import { useFavouriteTokensIdsSelector, useMarketTokenSlugSelector } from '../../../../store/market/market-selectors';
import { useTokenSelector } from '../../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { HiddenButton } from '../hidden-button/hidden-button';
import { RightSwipeViewSelectors } from './right-swipe-view.selectors';
import { useRightSwipeViewStyles } from './right-swipe-view.styles';

interface Props {
  id: string;
  onPress: EmptyFn;
}
export const RightSwipeView: FC<Props> = ({ id, onPress }) => {
  const colors = useColors();
  const styles = useRightSwipeViewStyles();
  const favouriteTokensIds = useFavouriteTokensIdsSelector();

  const marketCoinSlug = useMarketTokenSlugSelector(id);
  const outputToken = useTokenSelector(marketCoinSlug);

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
    navigate(ScreensEnum.SwapScreen, { outputToken });
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
};
