import React, { useState } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { generateScreenOptions } from 'src/components/header/generate-screen-options.util';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useManageAssetsStyles } from './manage-assets.styles';
import { ManageCollectibles } from './manage-collectibles/manage-collectibles';
import { ManageTokens } from './manage-tokens/manage-tokens';

const manageTokensIndex = 0;

export const ManageAssets = () => {
  const { navigate } = useNavigation();
  const styles = useManageAssetsStyles();
  const { collectibles } = useScreenParams<ScreensEnum.ManageAssets>();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(collectibles ? 1 : 0);
  const showManageTokens = segmentedControlIndex === manageTokensIndex;

  usePageAnalytic(ScreensEnum.ManageAssets);
  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Manage Assets" />,
      <HeaderButton iconName={IconNameEnum.PlusIconOrange} onPress={() => navigate(ModalsEnum.AddAsset)} />
    ),
    []
  );

  return (
    <>
      <Divider size={formatSize(8)} />
      <View style={styles.segmentControlContainer}>
        <TextSegmentControl
          selectedIndex={segmentedControlIndex}
          values={['Tokens', 'Collectibles']}
          onChange={setSegmentedControlIndex}
        />
      </View>

      <Divider size={formatSize(8)} />

      {showManageTokens ? <ManageTokens /> : <ManageCollectibles />}
    </>
  );
};
