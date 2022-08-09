import React, { useState } from 'react';
import { View } from 'react-native';

import { Disclaimer } from '../../components/disclaimer/disclaimer';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { useNetworkInfo } from '../../hooks/use-network-info.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { CryptoTopup } from './crypto/crypto-topup';
import { Debit } from './debit/debit';

const TABS = [
  {
    id: 0,
    name: 'Crypto',
    component: <CryptoTopup />
  },
  {
    id: 1,
    name: 'Debit/Credit Card',
    component: <Debit />
  }
];

export const Buy = () => {
  const { metadata } = useNetworkInfo();
  const { isDcpNode, metadata } = useNetworkInfo();
  const [tab, setTab] = useState(TABS[isDcpNode ? 1 : 0]);

  const handleTabChange = (newTabIndex: number) => setTab(TABS[newTabIndex]);

  usePageAnalytic(ScreensEnum.Buy);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View>
        <TextSegmentControl selectedIndex={tab.id} values={TABS.map(x => x.name)} onChange={handleTabChange} />
        {tab.component}
      </View>
      <Disclaimer
        title="Disclaimer"
        texts={[
          `Temple integrated third-party solutions to buy ${metadata.symbol} with crypto or a Debit/Credit card. Choose a provider, follow guides, get ${metadata.symbol} on your account.`
        ]}
      />
    </ScreenContainer>
  );
};
