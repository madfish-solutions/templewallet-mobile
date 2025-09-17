import React, { useCallback } from 'react';

import { HeaderButton } from 'src/components/header/header-button/header-button';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { HeaderCard } from 'src/components/header-card/header-card';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from 'src/components/token-screen-content-container/token-screen-content-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TezosTokenHistory } from './tezos-token-history/tezos-token-history';

export const TezosTokenScreen = () => {
  const { navigate } = useNavigation();
  const accountPkh = useCurrentAccountPkhSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();

  usePageAnalytic(ScreensEnum.TezosTokenScreen);

  const handleInfoIconClick = useCallback(
    () => navigate(ScreensEnum.TokenInfo, { token: tezosToken }),
    [navigate, tezosToken]
  );

  useNavigationSetOptions(
    {
      headerRight: () => <HeaderButton iconName={IconNameEnum.InfoAlt} onPress={handleInfoIconClick} />
    },
    []
  );

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={tezosToken} />

        <PublicKeyHashText publicKeyHash={accountPkh} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons token={tezosToken} />
      </HeaderCard>

      <TokenScreenContentContainer historyComponent={<TezosTokenHistory />} token={tezosToken} />
    </>
  );
};
