import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { generateHitSlop } from 'src/styles/generate-hit-slop';

import { WalletSelectors } from '../wallet.selectors';
import { CollectiblesHomeSwipeButtonStyle } from './collectibles-home-swipe-button.style';
import CollectiblesSvg from './collectibles.svg';

export const CollectiblesHomeSwipeButton = () => {
  const { navigate } = useNavigation();

  return (
    <TouchableOpacity
      style={CollectiblesHomeSwipeButtonStyle.root}
      hitSlop={generateHitSlop(formatSize(8))}
      onPress={() => navigate(ScreensEnum.CollectiblesHome)}
      testID={WalletSelectors.collectiblesButton}
    >
      <CollectiblesSvg height={formatSize(13)} />
    </TouchableOpacity>
  );
};
