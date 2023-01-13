import React, { useState } from 'react';
import { View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { generateScreenOptions } from '../../components/header/generate-screen-options.util';
import { HeaderButton } from '../../components/header/header-button/header-button';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { useManageAssetsStyles } from './manage-assets.styles';
import { ManageCollectibles } from './manage-collectibles/manage-collectibles';
import { ManageTokens } from './manage-tokens/manage-tokens';

const manageTokensIndex = 0;

export const ManageAssets = () => {
  const { navigate } = useNavigation();
  const styles = useManageAssetsStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageTokens = segmentedControlIndex === manageTokensIndex;

  usePageAnalytic(ScreensEnum.ManageAssets);
  useNavigationSetOptions(
    generateScreenOptions(
      <HeaderTitle title="Manage Assets" />,
      <HeaderButton iconName={IconNameEnum.PlusIconOrange} onPress={() => navigate(ModalsEnum.AddToken)} />
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
