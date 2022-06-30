import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useMemo } from 'react';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { HeaderTokenInfo } from '../../components/header/header-token-info/header-token-info';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from '../../components/token-screen-content-container/token-screen-content-container';
import { useTokenActivity } from '../../hooks/use-token-activity.hook';
import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { useSelectedAccountSelector, useTokensListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { getTokenSlug } from '../../token/utils/token.utils';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { TokenInfo } from './token-info/token-info';

export const TokenScreen = () => {
  const { token: initialToken } = useRoute<RouteProp<ScreensParamList, ScreensEnum.TokenScreen>>().params;
  const tokensList = useTokensListSelector();
  const token = useMemo(
    () =>
      tokensList.find(candidateToken => getTokenSlug(candidateToken) === getTokenSlug(initialToken)) ?? initialToken,
    [tokensList, initialToken]
  );

  const selectedAccount = useSelectedAccountSelector();
  const { activities, handleUpdate } = useTokenActivity(initialToken.address, initialToken.id.toString());

  useNavigationSetOptions({ headerTitle: () => <HeaderTokenInfo token={token} /> }, [token]);

  usePageAnalytic(ScreensEnum.TokenScreen);

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={token} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons token={token} />
      </HeaderCard>

      <TokenScreenContentContainer
        historyComponent={<ActivityGroupsList handleUpdate={handleUpdate} activityGroups={activities} />}
        infoComponent={<TokenInfo token={token} />}
        token={token}
      />
    </>
  );
};
