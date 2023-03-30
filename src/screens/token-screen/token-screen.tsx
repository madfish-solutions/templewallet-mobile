import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ActivityGroupsList } from 'src/components/activity-groups-list/activity-groups-list';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from 'src/components/header-card/header-card';
import { HeaderTokenInfo } from 'src/components/header/header-token-info/header-token-info';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from 'src/components/token-screen-content-container/token-screen-content-container';
import { useContractActivity } from 'src/hooks/use-contract-activity';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { loadPartnersPromoActions } from 'src/store/partners-promotion/partners-promotion-actions';
import { useIsPartnersPromoEnabledSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { highPriorityLoadTokenBalanceAction } from 'src/store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useSelectedAccountTezosTokenSelector,
  useTokensListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { OptimalPromotionAdType } from 'src/utils/optimal.utils';

import { TokenInfo } from './token-info/token-info';

export const TokenScreen = () => {
  const { token: initialToken } = useRoute<RouteProp<ScreensParamList, ScreensEnum.TokenScreen>>().params;

  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const tokensList = useTokensListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();

  const partnersPromotionEnabled = useIsPartnersPromoEnabledSelector();
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);

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
        publicKeyHash: selectedAccount.publicKeyHash,
        slug: getTokenSlug(token)
      })
    );
    dispatch(loadPartnersPromoActions.submit(OptimalPromotionAdType.TwMobile));
  }, []);

  const { activities, handleUpdate } = useContractActivity(getTokenSlug(initialToken));

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
        historyComponent={
          <ActivityGroupsList
            handleUpdate={handleUpdate}
            activityGroups={activities}
            shouldShowPromotion={partnersPromotionEnabled && !promotionErrorOccurred}
            onOptimalPromotionImageError={() => setPromotionErrorOccurred(true)}
          />
        }
        infoComponent={<TokenInfo token={token} />}
        token={token}
      />
    </>
  );
};
