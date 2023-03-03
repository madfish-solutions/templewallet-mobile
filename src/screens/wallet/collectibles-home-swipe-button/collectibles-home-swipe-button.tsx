import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { generateHitSlop } from '../../../styles/generate-hit-slop';
import { CollectiblesHomeSwipeButtonSelectors } from './collectibles-home-swipe-button.selectors';
import { CollectiblesHomeSwipeButtonStyle } from './collectibles-home-swipe-button.style';
import CollectiblesSvg from './collectibles.svg';

export const CollectiblesHomeSwipeButton = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      style={CollectiblesHomeSwipeButtonStyle.root}
      hitSlop={generateHitSlop(formatSize(8))}
      onPress={() => navigate(ScreensEnum.CollectiblesHome)}
      testID={CollectiblesHomeSwipeButtonSelectors.collectiblesButton}
    >
      <CollectiblesSvg height={formatSize(13)} />
    </TouchableOpacity>
  );
};
