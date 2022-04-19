import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { Disclaimer } from '../../components/disclaimer/disclaimer';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { Debit } from './debit';

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
  const [tab, setTab] = useState(TABS[1]);

  const handleTabChange = (newTabIndex: number) => setTab(TABS[newTabIndex]);

  const { pageEvent } = useAnalytics();
  useEffect(() => void pageEvent(ScreensEnum.Buy, ''), []);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        <TextSegmentControl selectedIndex={tab.id} values={TABS.map(x => x.name)} onChange={handleTabChange} />
        {tab.component}
      </View>
      {!tab.component && (
        <DataPlaceholder
          text={`Soon!
We are working on that.`}
        />
      )}
      <Disclaimer
        title="Disclaimer"
        texts={[
          'Temple integrated third-party solutions to buy TEZ with crypto or a Debit/Credit card. Choose a provider, follow guides, get TEZ on your account.'
        ]}
      />
    </ScreenContainer>
  );
};
