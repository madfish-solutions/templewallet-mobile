import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { Banner } from '../../../components/banner/banner';
import { TextSegmentControl } from '../../../components/segmented-control/text-segment-control/text-segment-control';
import { useGenerateArtStyles } from './generate-art.styles';
import { GenerateArtSelectors } from './selectors';
import { CreateNft } from './tabs/create-nft/create-nft';

const tabs = ['Create', 'History'];
const tabAnalyticsPropertiesFn = (tabName: string) => ({ tabName });

export const GenerateArtScreen: FC = () => {
  const styles = useGenerateArtStyles();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <View style={styles.root}>
        <Banner
          title="Create & Celebrate!"
          description="Convert text to NFT in three simple steps."
          style={styles.marginBottom}
        />

        <TextSegmentControl
          disabledValuesIndices={[1]}
          selectedIndex={tabIndex}
          values={tabs}
          onChange={setTabIndex}
          optionAnalyticsPropertiesFn={tabAnalyticsPropertiesFn}
          style={styles.marginBottom}
          testID={GenerateArtSelectors.tabSwitch}
        />
      </View>

      <CreateNft />
    </>
  );
};
