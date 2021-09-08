import React, { useState } from 'react';
import { View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { formatSize } from '../../styles/format-size';
import { useManageAssetsStyles } from './manage-assets.styles';
import { ManageCollectibles } from './manage-collectibles/manage-collectibles';
import { ManageTokens } from './manage-tokens/manage-tokens';

const manageTokensIndex = 0;

export const ManageAssets = () => {
  const styles = useManageAssetsStyles();

  const [segmentedControlIndex, setSegmentedControlIndex] = useState(0);
  const showManageTokens = segmentedControlIndex === manageTokensIndex;

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
