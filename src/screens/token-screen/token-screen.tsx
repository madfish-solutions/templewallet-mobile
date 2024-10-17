import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from 'src/components/activity-groups-list/activity-groups-list';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTokenInfo } from 'src/components/header/header-token-info/header-token-info';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { HeaderCard } from 'src/components/header-card/header-card';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from 'src/components/token-screen-content-container/token-screen-content-container';
import { useContractActivity } from 'src/hooks/use-contract-activity';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useScamTokenSlugsSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { highPriorityLoadTokenBalanceAction } from 'src/store/wallet/wallet-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

export const TokenScreen = () => {
  const { token: initialToken } = useRoute<RouteProp<ScreensParamList, ScreensEnum.TokenScreen>>().params;

  const { navigate } = useNavigation();

  const dispatch = useDispatch();
  const accountPkh = useCurrentAccountPkhSelector();
  const tokensList = useCurrentAccountTokens();
  const tezosToken = useTezosTokenOfCurrentAccount();

  const scamTokenSlugsRecord = useScamTokenSlugsSelector();

  const token = useMemo(() => {
    const slug = getTokenSlug(initialToken);
    if (slug === TEZ_TOKEN_SLUG) {
      return tezosToken;
    }

    return tokensList.find(candidateToken => getTokenSlug(candidateToken) === slug) ?? initialToken;
  }, [tokensList, initialToken, tezosToken]);

  useEffect(() => {
    dispatch(
      highPriorityLoadTokenBalanceAction({
        publicKeyHash: accountPkh,
        slug: getTokenSlug(token)
      })
    );
  }, []);

  const { activities, handleUpdate, isAllLoaded, isLoading } = useContractActivity(getTokenSlug(initialToken));

  const handleInfoIconClick = useCallback(() => navigate(ScreensEnum.TokenInfo, { token }), [navigate, token]);

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTokenInfo token={token} />,
      headerRight: () => <HeaderButton iconName={IconNameEnum.InfoAlt} onPress={handleInfoIconClick} />
    },
    [token]
  );

  usePageAnalytic(ScreensEnum.TokenScreen, undefined, { token: token.name });

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={token} />

        <PublicKeyHashText publicKeyHash={accountPkh} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons token={token} />
      </HeaderCard>

      <TokenScreenContentContainer
        historyComponent={
          <ActivityGroupsList
            handleUpdate={handleUpdate}
            activityGroups={activities}
            isAllLoaded={isAllLoaded}
            isLoading={isLoading}
            pageName="Token page"
          />
        }
        token={token}
        scam={scamTokenSlugsRecord[getTokenSlug(token)]}
      />
    </>
  );
};
