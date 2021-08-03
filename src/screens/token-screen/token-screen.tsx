import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from '../../components/activity-groups-list/activity-groups-list';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { HeaderTokenInfo } from '../../components/header/header-token-info/header-token-info';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from '../../components/token-screen-content-container/token-screen-content-container';
import { useFilteredActivityGroups } from '../../hooks/use-filtered-activity-groups.hook';
import { ScreensEnum, ScreensParamList } from '../../navigator/enums/screens.enum';
import { useExchangeRatesSelector } from '../../store/currency/currency-selectors';
import { loadActivityGroupsActions, loadTokenBalancesActions } from '../../store/wallet/wallet-actions';
import { useSelectedAccountSelector, useTokensListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { getTokenSlug } from '../../token/utils/token.utils';
import { TokenInfo } from './token-info/token-info';

export const TokenScreen = () => {
  const dispatch = useDispatch();
  const { token } = useRoute<RouteProp<ScreensParamList, ScreensEnum.TokenScreen>>().params;
  const tokensList = useTokensListSelector();
  const updatedToken = tokensList.find(candidateToken => getTokenSlug(candidateToken) === getTokenSlug(token)) ?? token;

  const selectedAccount = useSelectedAccountSelector();
  const { filteredActivityGroups, setSearchValue } = useFilteredActivityGroups();
  const { exchangeRates } = useExchangeRatesSelector();

  useNavigationSetOptions({ headerTitle: () => <HeaderTokenInfo token={token} /> }, [token]);

  useEffect(() => {
    dispatch(loadTokenBalancesActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadActivityGroupsActions.submit(selectedAccount.publicKeyHash));
  }, []);

  useEffect(() => setSearchValue(token.address), [token]);

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={token} exchangeRate={exchangeRates.data[getTokenSlug(token)]} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons token={updatedToken} />
      </HeaderCard>

      <TokenScreenContentContainer
        historyComponent={<ActivityGroupsList activityGroups={filteredActivityGroups} />}
        infoComponent={<TokenInfo token={token} />}
      />
    </>
  );
};
