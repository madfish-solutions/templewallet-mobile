import React, { useCallback, useState } from 'react';
import { View } from 'react-native';

import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useManageAssetsStyles } from './manage-assets.styles';
import { ManageCollectibles } from './manage-collectibles/manage-collectibles';
import { ManageTokens } from './manage-tokens/manage-tokens';

const manageTokensIndex = 0;

export const ManageAssets = () => {
  const styles = useManageAssetsStyles();
  const { collectibles } = useScreenParams<ScreensEnum.ManageAssets>();
  const { setParams } = useNavigation();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(collectibles ? 1 : 0);
  const showManageTokens = segmentedControlIndex === manageTokensIndex;

  const handleSegmentedControlChange = useCallback(
    (index: number) => {
      setSegmentedControlIndex(index);
      setParams({ collectibles: index !== manageTokensIndex });
    },
    [setParams]
  );

  usePageAnalytic(ScreensEnum.ManageAssets);

  return (
    <>
      <View style={styles.segmentControlContainer}>
        <TextSegmentControl
          selectedIndex={segmentedControlIndex}
          values={['Tokens', 'Collectibles']}
          onChange={handleSegmentedControlChange}
        />
      </View>

      {showManageTokens ? <ManageTokens /> : <ManageCollectibles />}
    </>
  );
};
