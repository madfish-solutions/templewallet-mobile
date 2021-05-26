import React from 'react';

import { DataPlaceholder } from '../../components/data-placeholder/data-placeholder';
import { HeaderCardActionButtons } from '../../components/header-card-action-buttons/header-card-action-buttons';
import { HeaderCard } from '../../components/header-card/header-card';
import { HeaderTokenInfo } from '../../components/header/header-token-info/header-token-info';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { TokenEquityValue } from '../../components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from '../../components/token-screen-content-container/token-screen-content-container';
import { useNavigationParams } from '../../navigator/use-navigation-params.hook';
import { useSelectedAccountSelector, useTokenSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { TokenInfo } from './token-info/token-info';

export const TokenScreen = () => {
  const selectedAccount = useSelectedAccountSelector();

  const slug = useNavigationParams('slug');
  const token = useTokenSelector(slug);

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTokenInfo token={token} />
    },
    [token]
  );

  return (
    <>
      <HeaderCard>
        <TokenEquityValue balance={token.balance} symbol={token.symbol} />

        <PublicKeyHashText publicKeyHash={selectedAccount.publicKeyHash} marginBottom={formatSize(16)} />

        <HeaderCardActionButtons />
      </HeaderCard>

      <TokenScreenContentContainer historyComponent={<DataPlaceholder />} infoComponent={<TokenInfo token={token} />} />
    </>
  );
};
