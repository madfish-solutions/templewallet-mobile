import React, { FC, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';

import { MarketCoin } from '../../../../store/market/market.interfaces';
import { RightSwipeView } from '../right-swipe-view/right-swipe-view';
import { Row } from '../row/row';

interface Props {
  item: MarketCoin;
}

export const SwipableRow: FC<Props> = ({ item }) => {
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  return (
    <Swipeable ref={swipeableRef} renderRightActions={() => <RightSwipeView id={item.id} onPress={closeSwipeable} />}>
      <Row item={item} />
    </Swipeable>
  );
};
