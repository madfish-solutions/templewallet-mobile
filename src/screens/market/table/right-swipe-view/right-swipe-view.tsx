import React, { FC, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../../components/divider/divider';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { addFavouriteToken, deleteFavouriteToken } from '../../../../store/market/market-actions';
import { useFavouriteTokens } from '../../../../store/market/market-selectors';
import { formatSize } from '../../../../styles/format-size';
import { useColors } from '../../../../styles/use-colors';
import { HiddenButton } from '../hidden-button/hidden-button';
import { useRightSwipeViewStyles } from './right-swipe-view.styles';

interface Props {
  slug: string;
}

export const RightSwipeView: FC<Props> = ({ slug }) => {
  const colors = useColors();
  const dispatch = useDispatch();
  const favouriteTokens = useFavouriteTokens();
  const styles = useRightSwipeViewStyles();

  const isFavourite = useMemo(() => favouriteTokens.includes(slug), [favouriteTokens]);
  const handleAddToFavourites = useCallback(() => dispatch(addFavouriteToken(slug)), []);
  const handleDeleteFromFavourites = useCallback(() => dispatch(deleteFavouriteToken(slug)), []);
  const handlePress = isFavourite ? handleDeleteFromFavourites : handleAddToFavourites;

  return (
    <View style={styles.rootContainer}>
      <HiddenButton iconName={IconNameEnum.Buy} text="Buy" onPress={() => console.log('Buy')} />
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
