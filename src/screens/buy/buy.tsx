import React, { useState } from 'react';
import { View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { useBuyStyles } from './buy.styles';
import { Debit } from './debit';
import { Disclaimer } from './disclaimer/disclaimer';

const TABS = [
  {
    id: 0,
    name: 'Crypto'
  },
  {
    id: 1,
    name: 'Debit/Credit Card',
    component: <Debit />
  }
];

export const Buy = () => {
  const styles = useBuyStyles();
  const [tab, setTab] = useState(TABS[1]);

  const handleTabChange = (newTabIndex: number) => setTab(TABS[newTabIndex]);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.upperContainer}>
        <TextSegmentControl selectedIndex={tab.id} values={TABS.map(x => x.name)} onChange={handleTabChange} />
        {tab.component}
      </View>
      {!tab.component && (
        <DataPlaceholder
          text={`Soon!
We are working on that.`}
        />
      )}
      {!isTablet() && <Disclaimer />}
    </ScreenContainer>
  );
};
