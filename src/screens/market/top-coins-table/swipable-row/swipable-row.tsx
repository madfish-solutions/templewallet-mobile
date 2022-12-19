import React, { FC, useRef } from 'react';
import { Swipeable } from 'react-native-gesture-handler';

import { MarketToken } from '../../../../store/market/market.interfaces';
import { RightSwipeView } from '../right-swipe-view/right-swipe-view';
import { Row } from '../row/row';

interface Props {
  item: MarketToken;
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
