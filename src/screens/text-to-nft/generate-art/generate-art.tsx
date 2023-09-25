import React, { FC, useState } from 'react';
import { View } from 'react-native';

import { Banner } from 'src/components/banner/banner';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { History } from 'src/screens/text-to-nft/generate-art/tabs/history/history';

import { useGenerateArtStyles } from './generate-art.styles';
import { GenerateArtSelectors } from './selectors';
import { Create } from './tabs/create/create';

const tabs = ['Create', 'History'];
const tabAnalyticsPropertiesFn = (tabName: string) => ({ tabName });

export const GenerateArtScreen: FC = () => {
  const styles = useGenerateArtStyles();

  const [tabIndex, setTabIndex] = useState(0);
  const isCreateNftTabSelected = tabIndex === 0;

  return (
    <>
      <View style={styles.root}>
        <Banner
          title="Create & Celebrate!"
          description="Convert text to NFT in three simple steps."
          style={styles.marginBottom}
        />

        <TextSegmentControl
          selectedIndex={tabIndex}
          values={tabs}
          onChange={setTabIndex}
          optionAnalyticsPropertiesFn={tabAnalyticsPropertiesFn}
          style={styles.marginBottom}
          testID={GenerateArtSelectors.tabSwitch}
        />
      </View>

      {isCreateNftTabSelected ? <Create /> : <History />}
    </>
  );
};
